import os
import sys
import django
from pathlib import Path

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from businesses.models import Business, BusinessMembership
from uploads.cleaners import process_sales_csv, process_expenses_csv
from uploads.models import Dataset

def run_seed():
    print("🌱 Seeding initial demo data for BizLens...")

    # 1. Create Demo Admin User
    user, created = User.objects.get_or_create(
        email='admin@bizlens.com',
        defaults={
            'username': 'admin',
            'full_name': 'Dvijesha Admin',
        }
    )
    if created:
        user.set_password('password123')
        user.save()
        print("✓ Created Demo User: admin@bizlens.com / password123")
    else:
        print("✓ Demo User admin@bizlens.com exists.")

    # 2. Create Demo Business
    business, biz_created = Business.objects.get_or_create(
        name='Dvijesha Retail & Tech',
        defaults={
            'industry': 'Electronics & Retail',
            'currency': 'INR'
        }
    )

    # 3. Create Business Membership
    BusinessMembership.objects.get_or_create(
        user=user,
        business=business,
        defaults={'role': 'OWNER'}
    )
    print(f"✓ Created Business Tenant: '{business.name}' for User.")

    # 4. Import Sample Sales CSV if present
    sample_dir = BASE_DIR.parent / 'sample_data'
    sales_file_path = sample_dir / 'sales_sample.csv'
    expenses_file_path = sample_dir / 'expenses_sample.csv'

    if sales_file_path.exists():
        with open(sales_file_path, 'rb') as f:
            stats = process_sales_csv(f, business)
            Dataset.objects.create(
                business=business,
                dataset_type='SALES',
                file_name='sales_sample.csv',
                status='COMPLETED',
                total_records=stats['total_records'],
                valid_records=stats['valid_records'],
                duplicates_removed=stats['duplicates_removed'],
                missing_handled=stats['missing_handled'],
                quality_score=stats['quality_score']
            )
            print(f"✓ Processed Sales Sample CSV ({stats['valid_records']} transactions imported, Quality Score: {stats['quality_score']}%).")

    if expenses_file_path.exists():
        with open(expenses_file_path, 'rb') as f:
            stats = process_expenses_csv(f, business)
            Dataset.objects.create(
                business=business,
                dataset_type='EXPENSES',
                file_name='expenses_sample.csv',
                status='COMPLETED',
                total_records=stats['total_records'],
                valid_records=stats['valid_records'],
                duplicates_removed=stats['duplicates_removed'],
                missing_handled=stats['missing_handled'],
                quality_score=stats['quality_score']
            )
            print(f"✓ Processed Expenses Sample CSV ({stats['valid_records']} expenses imported, Quality Score: {stats['quality_score']}%).")

    # 5. Create DMfestives Business Tenant
    dmf_biz, dmf_created = Business.objects.get_or_create(
        name='DMfestives',
        defaults={
            'industry': 'Festive Decor & Gifting',
            'currency': 'INR'
        }
    )
    BusinessMembership.objects.get_or_create(
        user=user,
        business=dmf_biz,
        defaults={'role': 'OWNER'}
    )
    print(f"✓ Created Business Tenant: '{dmf_biz.name}' for User.")

    dmf_sales = sample_dir / 'dmfestives_sales.csv'
    dmf_expenses = sample_dir / 'dmfestives_expenses.csv'

    if dmf_sales.exists():
        with open(dmf_sales, 'rb') as f:
            stats = process_sales_csv(f, dmf_biz)
            Dataset.objects.create(
                business=dmf_biz,
                dataset_type='SALES',
                file_name='dmfestives_sales.csv',
                status='COMPLETED',
                total_records=stats['total_records'],
                valid_records=stats['valid_records'],
                duplicates_removed=stats['duplicates_removed'],
                missing_handled=stats['missing_handled'],
                quality_score=stats['quality_score']
            )
            print(f"✓ Processed DMfestives Sales CSV ({stats['valid_records']} transactions, Quality Score: {stats['quality_score']}%).")

    if dmf_expenses.exists():
        with open(dmf_expenses, 'rb') as f:
            stats = process_expenses_csv(f, dmf_biz)
            Dataset.objects.create(
                business=dmf_biz,
                dataset_type='EXPENSES',
                file_name='dmfestives_expenses.csv',
                status='COMPLETED',
                total_records=stats['total_records'],
                valid_records=stats['valid_records'],
                duplicates_removed=stats['duplicates_removed'],
                missing_handled=stats['missing_handled'],
                quality_score=stats['quality_score']
            )
            print(f"✓ Processed DMfestives Expenses CSV ({stats['valid_records']} expenses, Quality Score: {stats['quality_score']}%).")

    print("\n🎉 BizLens Demo Seed Completed Successfully!")

if __name__ == '__main__':
    run_seed()
