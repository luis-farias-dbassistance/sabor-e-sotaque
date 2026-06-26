import boto3
import argparse
import json
import datetime
from botocore.exceptions import ClientError

# Definición de los tags a aplicar
TAGS = {
    'System': 'sabor-e-sotaque',
    'Application': 'sabor-e-sotaque',
    'Owner': 'luis farias',
    'Environment': 'test',
    'Project': 'portugues-para-turismo-cl'
}

def get_resources_to_tag(client):
    """
    Obtiene todos los recursos usando ResourceGroupsTaggingAPI
    que no tienen el tag 'System'.
    """
    resources = []
    try:
        paginator = client.get_paginator('get_resources')
        for page in paginator.paginate():
            for resource in page.get('ResourceTagMappingList', []):
                arn = resource['ResourceARN']
                tags = {tag['Key']: tag['Value'] for tag in resource.get('Tags', [])}
                
                # Filtrar solo componentes que pertenezcan a la app (por nombre en ARN)
                if 'sabor-sotaque' in arn.lower() or 'sabor-e-sotaque' in arn.lower() or 'saborsotaque' in arn.lower():
                    # Si el recurso no tiene el tag 'System', lo agregamos a la lista
                    if 'System' not in tags:
                        resources.append({'ARN': arn, 'Tags': tags})
    except Exception as e:
        print(f"Error al obtener recursos (ResourceGroupsTaggingAPI): {e}")
    
    return resources

def list_s3_buckets_to_tag(s3_client):
    """
    Lista todos los buckets de S3 y devuelve aquellos que no tienen el tag 'System'.
    """
    buckets_to_tag = []
    try:
        response = s3_client.list_buckets()
        for bucket in response.get('Buckets', []):
            bucket_name = bucket['Name']
            
            # Obtener tags del bucket
            try:
                tags_response = s3_client.get_bucket_tagging(Bucket=bucket_name)
                tags = {tag['Key']: tag['Value'] for tag in tags_response.get('TagSet', [])}
            except ClientError as e:
                # Si no tiene tags, lanza NoSuchTagSet
                if e.response['Error']['Code'] == 'NoSuchTagSet':
                    tags = {}
                else:
                    print(f"Error al obtener tags del bucket {bucket_name}: {e}")
                    continue
            except Exception as e:
                print(f"Error inesperado al obtener tags de {bucket_name}: {e}")
                continue
            
            # Filtrar solo buckets que pertenezcan a la app
            if 'sabor-sotaque' in bucket_name.lower() or 'sabor-e-sotaque' in bucket_name.lower() or 'saborsotaque' in bucket_name.lower():
                # Filtramos si no tiene el tag 'System'
                if 'System' not in tags:
                    buckets_to_tag.append({'Name': bucket_name, 'Tags': tags})
    except Exception as e:
        print(f"Error al listar buckets de S3: {e}")
    
    return buckets_to_tag

def main():
    parser = argparse.ArgumentParser(description='Script para catalogar (taggear) recursos de AWS para el proyecto sabor-e-sotaque')
    parser.add_argument('--apply', action='store_true', help='Ejecuta los cambios reales (Aplica los tags)')
    parser.add_argument('--dry-run', action='store_true', help='Modo simulación (activo por defecto si no se pasa --apply)')
    args = parser.parse_args()

    # Si se pasa --apply, dry_run es falso. De lo contrario, siempre es dry_run.
    dry_run = not args.apply

    if not dry_run:
        print("¡ATENCIÓN! Estás a punto de modificar recursos en AWS.")
        confirm = input("¿Estás seguro de que quieres aplicar los tags reales? (s/n): ")
        if confirm.lower() != 's':
            print("Operación cancelada por el usuario.")
            return

    # Clientes de boto3 (región especificada us-east-1)
    region = 'us-east-1'
    tagging_client = boto3.client('resourcegroupstaggingapi', region_name=region)
    s3_client = boto3.client('s3', region_name=region)

    # Estructura del reporte
    report = {
        'total_recursos_encontrados': 0,
        'total_recursos_taggeados': 0,
        'recursos_taggeados': [],
        'errores': [],
        'recursos_no_taggeables': [],
        'fecha_hora_ejecucion': datetime.datetime.now().isoformat()
    }

    print("Inventariando recursos...\n")
    
    # 1. Obtener recursos generales
    resources = get_resources_to_tag(tagging_client)
    
    # Separar recursos taggeables de las excepciones
    taggable_resources = []
    for res in resources:
        arn = res['ARN']
        # Identificar el servicio a partir del ARN (ej: arn:aws:iam::...)
        parts = arn.split(':')
        service = parts[2] if len(parts) > 2 else 'unknown'
        
        # Excepciones que no se pueden taggear con ResourceGroupsTaggingAPI
        if service in ['iam', 'route53']:
            report['recursos_no_taggeables'].append({'ARN': arn, 'Tipo': service})
        else:
            taggable_resources.append(res)
            
    # 2. Obtener buckets de S3
    s3_buckets = list_s3_buckets_to_tag(s3_client)
    
    # Mostrar por pantalla lo encontrado
    print("--- RECURSOS ENCONTRADOS SIN EL TAG 'System' ---")
    for b in s3_buckets:
        print(f"[s3 bucket] {b['Name']}")
        
    for res in taggable_resources:
        arn = res['ARN']
        tipo = arn.split(':')[2] if len(arn.split(':')) > 2 else 'unknown'
        print(f"[{tipo}] {arn}")
        
    for res in report['recursos_no_taggeables']:
        print(f"[{res['Tipo']}] {res['ARN']} (NO TAGGEABLE MEDIANTE API)")

    report['total_recursos_encontrados'] = len(taggable_resources) + len(s3_buckets) + len(report['recursos_no_taggeables'])

    if dry_run:
        print("\n=== MODO DRY RUN: No se aplicarán cambios reales ===")
    else:
        print("\n=== MODO APPLY: Aplicando tags reales ===")

    # 3. Aplicar tags en lotes de 20 para ResourceGroupsTaggingAPI
    for i in range(0, len(taggable_resources), 20):
        batch = taggable_resources[i:i+20]
        arns = [res['ARN'] for res in batch]
        
        if dry_run:
            for arn in arns:
                tipo = arn.split(':')[2] if len(arn.split(':')) > 2 else 'unknown'
                report['recursos_taggeados'].append({'ARN': arn, 'Tipo': tipo})
                report['total_recursos_taggeados'] += 1
            print(f"[Dry Run] Se aplicarían tags a {len(arns)} recursos generales.")
        else:
            try:
                response = tagging_client.tag_resources(
                    ResourceARNList=arns,
                    Tags=TAGS
                )
                
                # Procesar posibles errores parciales en el batch
                failed = response.get('FailedResourcesMap', {})
                for failed_arn, error_details in failed.items():
                    print(f"Error al taggear {failed_arn}: {error_details.get('ErrorMessage')}")
                    report['errores'].append({'ARN': failed_arn, 'Error': error_details.get('ErrorMessage')})
                    if failed_arn in arns:
                        arns.remove(failed_arn)
                        
                # Registrar los exitosos
                for arn in arns:
                    tipo = arn.split(':')[2] if len(arn.split(':')) > 2 else 'unknown'
                    report['recursos_taggeados'].append({'ARN': arn, 'Tipo': tipo})
                    report['total_recursos_taggeados'] += 1
                    print(f"Tags aplicados correctamente a: {arn}")
                    
            except Exception as e:
                print(f"Excepción al procesar batch de tags: {e}")
                report['errores'].append({'Batch': arns, 'Error': str(e)})

    # 4. Aplicar tags a S3 Buckets
    for bucket in s3_buckets:
        bucket_name = bucket['Name']
        if dry_run:
            print(f"[Dry Run] Se aplicarían tags al bucket S3: {bucket_name}")
            report['recursos_taggeados'].append({'ARN': f"arn:aws:s3:::{bucket_name}", 'Tipo': 's3'})
            report['total_recursos_taggeados'] += 1
        else:
            try:
                # Mantener tags existentes y agregar los nuevos
                existing_tags = bucket['Tags']
                existing_tags.update(TAGS)
                
                # Formato requerido por put_bucket_tagging
                merged_tags_formatted = [{'Key': k, 'Value': v} for k, v in existing_tags.items()]
                
                s3_client.put_bucket_tagging(
                    Bucket=bucket_name,
                    Tagging={'TagSet': merged_tags_formatted}
                )
                print(f"Tags aplicados correctamente al bucket S3: {bucket_name}")
                report['recursos_taggeados'].append({'ARN': f"arn:aws:s3:::{bucket_name}", 'Tipo': 's3'})
                report['total_recursos_taggeados'] += 1
            except Exception as e:
                print(f"Error al taggear bucket {bucket_name}: {e}")
                report['errores'].append({'ARN': f"arn:aws:s3:::{bucket_name}", 'Error': str(e)})

    # 5. Generar archivo JSON de reporte
    report_filename = 'tagging_report_sabor-e-sotaque.json'
    with open(report_filename, 'w') as f:
        json.dump(report, f, indent=4, ensure_ascii=False)
        
    print(f"\nReporte final generado en: {report_filename}")
    print(f"Total encontrados: {report['total_recursos_encontrados']}")
    print(f"Total taggeados (o simulados): {report['total_recursos_taggeados']}")
    print(f"Errores: {len(report['errores'])}")
    print(f"No taggeables: {len(report['recursos_no_taggeables'])}")

if __name__ == '__main__':
    main()
