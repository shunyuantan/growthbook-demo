/* eslint-disable @typescript-eslint/no-unused-vars */
import { ServerClient } from 'postmark';

const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;

export async function POST(req: Request, res: Response) {
  const client = new ServerClient(POSTMARK_API_KEY ?? '');
  const result = await client.sendEmailWithTemplate({
    From: 'shun.tan@xendit.co',
    To: 'shun.tan@xendit.co',
    TemplateId: 32996020,
    TemplateModel: {
      product_url: 'product_url_Value',
      product_name: 'product_name_Value',
      banner_url: 'banner_url_Value',
      variation: 'variation_Value',
      invoice_id: 'invoice_id_Value',
      company_name: 'company_name_Value',
      company_address: 'company_address_Value',
    },
  });

  console.log(result);
  return new Response('Hello world!');
}
