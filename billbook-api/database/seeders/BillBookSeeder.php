<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Document;
use App\Models\DocumentLineItem;
use App\Models\Expense;
use App\Models\ItemTemplate;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BillBookSeeder extends Seeder
{
    public function run(): void
    {
        if (Client::query()->exists() || Document::query()->exists()) {
            return;
        }

        Setting::query()->truncate();
        Setting::query()->create([
            'theme' => 'light',
            'company_name' => 'Acme Studio',
            'logo_base64' => null,
            'logo_path' => null,
            'address' => '223 Indiranagar, Bengaluru, India',
            'email' => 'billing@acmestudio.in',
            'phone' => '+91 98765 43210',
            'tax_id' => '29ABCDE1234F1Z5',
            'website' => 'https://acmestudio.in',
            'default_currency' => 'INR',
            'default_tax_percent' => 18,
            'payment_terms_days' => 30,
            'default_notes' => 'Thank you for your business!',
            'default_terms' => 'Payment due within 30 days of issue date.',
            'invoice_prefix' => 'INV',
            'quote_prefix' => 'QT',
        ]);

        $clients = collect([
            [
                'id' => 'client-aarav-sharma',
                'name' => 'Aarav Sharma',
                'email' => 'aarav.sharma@techvista.in',
                'phone' => '+91 98201 45321',
                'address' => 'Acme Solutions Pvt Ltd, Bengaluru, India',
                'tax_id' => '29AABCT1234A1Z1',
            ],
            [
                'id' => 'client-priya-nair',
                'name' => 'Priya Nair',
                'email' => 'priya@nairdesigns.co.in',
                'phone' => '+91 99452 78104',
                'address' => 'Nair Designs, Kochi, Kerala',
                'tax_id' => '32AABCN1234F1Z2',
            ],
            [
                'id' => 'client-rohan-kulkarni',
                'name' => 'Rohan Kulkarni',
                'email' => 'rohan.k@kulkarnilabs.in',
                'phone' => '+91 97650 33219',
                'address' => 'Kulkarni Labs, Pune, Maharashtra',
                'tax_id' => '27AABCK5678L1Z9',
            ],
            [
                'id' => 'client-ananya-iyer',
                'name' => 'Ananya Iyer',
                'email' => 'ananya@iyerconsulting.in',
                'phone' => '+91 98409 11876',
                'address' => 'Iyer Consulting, Chennai, Tamil Nadu',
                'tax_id' => '33AABCI9012M1Z4',
            ],
            [
                'id' => 'client-vikram-singh',
                'name' => 'Vikram Singh',
                'email' => 'vikram@jaipurcraft.com',
                'phone' => '+91 98290 65432',
                'address' => 'Jaipur Craft Co, Jaipur, Rajasthan',
                'tax_id' => '08AABCJ3456N1Z7',
            ],
            [
                'id' => 'client-meera-deshmukh',
                'name' => 'Meera Deshmukh',
                'email' => 'meera@deshmukhmedia.in',
                'phone' => '+91 98220 90415',
                'address' => 'Deshmukh Media, Mumbai, Maharashtra',
                'tax_id' => '27AABCD7890P1Z3',
            ],
        ])->map(fn (array $row): Client => Client::query()->create($row))->keyBy('id');

        $items = collect([
            [
                'id' => 'item-web-dev',
                'name' => 'Web Development',
                'description' => 'React frontend & API',
                'default_rate' => 45000,
                'default_tax_percent' => 18,
                'unit' => 'project',
            ],
            [
                'id' => 'item-logo-design',
                'name' => 'Logo Design',
                'description' => 'Brand kit & SVG files',
                'default_rate' => 15000,
                'default_tax_percent' => 18,
                'unit' => 'unit',
            ],
            [
                'id' => 'item-hosting-setup',
                'name' => 'Hosting Setup',
                'description' => 'Cloud deploy & SSL',
                'default_rate' => 4000,
                'default_tax_percent' => 18,
                'unit' => 'unit',
            ],
            [
                'id' => 'item-ui-ux-sprint',
                'name' => 'UI/UX Design Sprint',
                'description' => 'Wireframes and interactive Figma prototype',
                'default_rate' => 28000,
                'default_tax_percent' => 18,
                'unit' => 'sprint',
            ],
        ])->map(fn (array $row): ItemTemplate => ItemTemplate::query()->create($row))->keyBy('id');

        $now = now();
        $m0 = $now->copy()->startOfMonth();
        $m1 = $now->copy()->subMonthNoOverflow()->startOfMonth();
        $m2 = $now->copy()->subMonthsNoOverflow(2)->startOfMonth();
        $m3 = $now->copy()->subMonthsNoOverflow(3)->startOfMonth();
        $m4 = $now->copy()->subMonthsNoOverflow(4)->startOfMonth();
        $m5 = $now->copy()->subMonthsNoOverflow(5)->startOfMonth();

        $invoiceSeeds = [
            [
                'number' => 'INV-0035',
                'status' => 'paid',
                'client' => $clients['client-rohan-kulkarni'],
                'issue_date' => $m5->copy()->addDays(10)->toDateString(),
                'due_date' => $m5->copy()->addDays(40)->toDateString(),
                'items' => [
                    ['template' => $items['item-ui-ux-sprint'], 'qty' => 1, 'price' => 27118.64, 'tax' => 18, 'discount' => 0],
                ],
            ],
            [
                'number' => 'INV-0036',
                'status' => 'paid',
                'client' => $clients['client-ananya-iyer'],
                'issue_date' => $m4->copy()->addDays(12)->toDateString(),
                'due_date' => $m4->copy()->addDays(42)->toDateString(),
                'items' => [
                    ['template' => $items['item-web-dev'], 'qty' => 1, 'price' => 37288.14, 'tax' => 18, 'discount' => 0],
                ],
            ],
            [
                'number' => 'INV-0037',
                'status' => 'paid',
                'client' => $clients['client-meera-deshmukh'],
                'issue_date' => $m3->copy()->addDays(8)->toDateString(),
                'due_date' => $m3->copy()->addDays(38)->toDateString(),
                'items' => [
                    ['template' => $items['item-web-dev'], 'qty' => 1, 'price' => 45000, 'tax' => 18, 'discount' => 0],
                    ['template' => $items['item-hosting-setup'], 'qty' => 2, 'price' => 3347.46, 'tax' => 18, 'discount' => 0],
                ],
            ],
            [
                'number' => 'INV-0038',
                'status' => 'paid',
                'client' => $clients['client-aarav-sharma'],
                'issue_date' => $m2->copy()->addDays(15)->toDateString(),
                'due_date' => $m2->copy()->addDays(45)->toDateString(),
                'items' => [
                    ['template' => $items['item-web-dev'], 'qty' => 1, 'price' => 40677.97, 'tax' => 18, 'discount' => 0],
                ],
            ],
            [
                'number' => 'INV-0039',
                'status' => 'sent',
                'client' => $clients['client-vikram-singh'],
                'issue_date' => $m1->copy()->addDays(5)->toDateString(),
                'due_date' => $now->copy()->subDays(8)->toDateString(),
                'items' => [
                    ['template' => $items['item-web-dev'], 'qty' => 2, 'price' => 45000, 'tax' => 18, 'discount' => 0],
                    ['template' => $items['item-logo-design'], 'qty' => 1, 'price' => 10000, 'tax' => 18, 'discount' => 0],
                ],
            ],
            [
                'number' => 'INV-0040',
                'status' => 'draft',
                'client' => $clients['client-rohan-kulkarni'],
                'issue_date' => $m0->copy()->addDays(1)->toDateString(),
                'due_date' => $m0->copy()->addDays(31)->toDateString(),
                'items' => [
                    ['template' => $items['item-ui-ux-sprint'], 'qty' => 1, 'price' => 36016.95, 'tax' => 18, 'discount' => 0],
                ],
            ],
            [
                'number' => 'INV-0041',
                'status' => 'paid',
                'client' => $clients['client-priya-nair'],
                'issue_date' => $m0->copy()->addDays(7)->toDateString(),
                'due_date' => $m0->copy()->addDays(37)->toDateString(),
                'items' => [
                    ['template' => $items['item-web-dev'], 'qty' => 1, 'price' => 57033.90, 'tax' => 18, 'discount' => 0],
                    ['template' => $items['item-logo-design'], 'qty' => 1, 'price' => 15000, 'tax' => 18, 'discount' => 0],
                ],
            ],
            [
                'number' => 'INV-0042',
                'status' => 'sent',
                'client' => $clients['client-aarav-sharma'],
                'issue_date' => $now->copy()->subDays(1)->toDateString(),
                'due_date' => $now->copy()->addDays(29)->toDateString(),
                'items' => [
                    ['template' => $items['item-web-dev'], 'qty' => 1, 'price' => 45000, 'tax' => 18, 'discount' => 0],
                    ['template' => $items['item-logo-design'], 'qty' => 1, 'price' => 15000, 'tax' => 18, 'discount' => 10],
                    ['template' => $items['item-hosting-setup'], 'qty' => 2, 'price' => 4000, 'tax' => 18, 'discount' => 0],
                ],
            ],
        ];

        foreach ($invoiceSeeds as $seed) {
            /** @var Client $client */
            $client = $seed['client'];
            $doc = Document::query()->create([
                'id' => strtolower($seed['number']),
                'type' => Document::TYPE_INVOICE,
                'number' => $seed['number'],
                'status' => $seed['status'],
                'client_id' => $client->id,
                'client_snapshot' => $client->toSnapshot(),
                'currency' => 'INR',
                'notes' => 'Thank you for your business!',
                'terms' => 'Payment due within 30 days of issue date.',
                'issue_date' => $seed['issue_date'],
                'due_date' => $seed['due_date'],
                'paid_at' => $seed['status'] === 'paid' ? $seed['issue_date'] : null,
            ]);

            foreach ($seed['items'] as $index => $line) {
                /** @var ItemTemplate $template */
                $template = $line['template'];
                DocumentLineItem::query()->create([
                    'id' => (string) Str::uuid(),
                    'document_id' => $doc->id,
                    'item_template_id' => $template->id,
                    'sort_order' => $index,
                    'name' => $template->name,
                    'description' => $template->description ?? '',
                    'quantity' => $line['qty'],
                    'unit_price' => $line['price'],
                    'tax_percent' => $line['tax'],
                    'discount_percent' => $line['discount'],
                ]);
            }
        }

        $quoteSeeds = [
            [
                'number' => 'QT-0013',
                'status' => 'draft',
                'client' => $clients['client-meera-deshmukh'],
                'issue_date' => $m0->copy()->addDays(4)->toDateString(),
                'valid_until' => $m0->copy()->addDays(19)->toDateString(),
                'items' => [
                    ['template' => $items['item-ui-ux-sprint'], 'qty' => 1, 'price' => 28000, 'tax' => 18, 'discount' => 0],
                    ['template' => $items['item-logo-design'], 'qty' => 1, 'price' => 13101.69, 'tax' => 18, 'discount' => 0],
                ],
            ],
            [
                'number' => 'QT-0014',
                'status' => 'accepted',
                'client' => $clients['client-ananya-iyer'],
                'issue_date' => $m0->copy()->addDays(13)->toDateString(),
                'valid_until' => $m0->copy()->addDays(28)->toDateString(),
                'items' => [
                    ['template' => $items['item-web-dev'], 'qty' => 1, 'price' => 52542.37, 'tax' => 18, 'discount' => 0],
                ],
            ],
            [
                'number' => 'QT-0015',
                'status' => 'sent',
                'client' => $clients['client-priya-nair'],
                'issue_date' => $now->copy()->subDays(1)->toDateString(),
                'valid_until' => $now->copy()->addDays(14)->toDateString(),
                'items' => [
                    ['template' => $items['item-web-dev'], 'qty' => 1, 'price' => 45000, 'tax' => 18, 'discount' => 0],
                    ['template' => $items['item-logo-design'], 'qty' => 1, 'price' => 15000, 'tax' => 18, 'discount' => 10],
                ],
            ],
        ];

        foreach ($quoteSeeds as $seed) {
            /** @var Client $client */
            $client = $seed['client'];
            $doc = Document::query()->create([
                'id' => strtolower($seed['number']),
                'type' => Document::TYPE_QUOTE,
                'number' => $seed['number'],
                'status' => $seed['status'],
                'client_id' => $client->id,
                'client_snapshot' => $client->toSnapshot(),
                'currency' => 'INR',
                'notes' => 'Thank you for considering our proposal.',
                'terms' => 'Quote valid for 15 days from issue date.',
                'issue_date' => $seed['issue_date'],
                'valid_until' => $seed['valid_until'],
            ]);

            foreach ($seed['items'] as $index => $line) {
                /** @var ItemTemplate $template */
                $template = $line['template'];
                DocumentLineItem::query()->create([
                    'id' => (string) Str::uuid(),
                    'document_id' => $doc->id,
                    'item_template_id' => $template->id,
                    'sort_order' => $index,
                    'name' => $template->name,
                    'description' => $template->description ?? '',
                    'quantity' => $line['qty'],
                    'unit_price' => $line['price'],
                    'tax_percent' => $line['tax'],
                    'discount_percent' => $line['discount'],
                ]);
            }
        }

        $expenses = [
            ['date' => $m0->copy()->addDays(21)->toDateString(), 'category' => 'Software', 'amount' => 4800, 'vendor' => 'AWS Hosting', 'notes' => 'Monthly cloud infrastructure'],
            ['date' => $m0->copy()->addDays(18)->toDateString(), 'category' => 'Travel', 'amount' => 1450, 'vendor' => 'Uber Business', 'notes' => 'Client site commute'],
            ['date' => $m0->copy()->addDays(15)->toDateString(), 'category' => 'Software', 'amount' => 3700, 'vendor' => 'Figma Subscription', 'notes' => 'Team design seats'],
            ['date' => $m0->copy()->addDays(11)->toDateString(), 'category' => 'Office Supplies', 'amount' => 6200, 'vendor' => 'Ergonomic Office Chair', 'notes' => 'Workspace upgrade'],
            ['date' => $m0->copy()->addDays(8)->toDateString(), 'category' => 'Travel', 'amount' => 10550, 'vendor' => 'IndiGo Flight - Mumbai', 'notes' => 'Client discovery workshop'],
            ['date' => $m0->copy()->addDays(4)->toDateString(), 'category' => 'Meals', 'amount' => 2400, 'vendor' => 'Client Lunch - Blue Tokai', 'notes' => 'Project kickoff lunch'],
            ['date' => $m0->copy()->addDays(1)->toDateString(), 'category' => 'Miscellaneous', 'amount' => 3300, 'vendor' => 'Courier & Postage', 'notes' => 'Signed agreement dispatch'],
            ['date' => $m1->copy()->addDays(14)->toDateString(), 'category' => 'Software', 'amount' => 4600, 'vendor' => 'AWS Hosting', 'notes' => 'Previous month infrastructure'],
            ['date' => $m1->copy()->addDays(9)->toDateString(), 'category' => 'Marketing', 'amount' => 5500, 'vendor' => 'LinkedIn Ads', 'notes' => 'Portfolio promotion'],
        ];

        foreach ($expenses as $expense) {
            Expense::query()->create([
                'date' => $expense['date'],
                'category' => $expense['category'],
                'amount' => $expense['amount'],
                'currency' => 'INR',
                'vendor' => $expense['vendor'],
                'notes' => $expense['notes'],
            ]);
        }
    }
}
