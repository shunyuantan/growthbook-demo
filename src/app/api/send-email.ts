/* eslint-disable @typescript-eslint/no-unused-vars */
import { GrowthBook } from '@growthbook/growthbook-react';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ServerClient } from 'postmark';
import { getServerSideGrowthBookContext } from '@/utils/growthbook-server';
const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;

// export async function POST(req: Request, res: Response) {
//   const gbContext = getServerSideGrowthBookContext();
//   const gb = new GrowthBook(gbContext);
// await gb.loadFeatures();

// const bannerFeatureFlag = gb.getFeatureValue('nex_card_banner_v2', {});
// console.log(bannerFeatureFlag);

// const client = new ServerClient(POSTMARK_API_KEY ?? '');
// const result = await client.sendEmailWithTemplate({
//   From: 'shun.tan@xendit.co',
//   To: 'shun.tan@xendit.co',
//   TemplateId: 32996020,
//   TemplateModel: {
//     product_url: 'product_url_Value',
//     product_name: 'product_name_Value',
//     banner_url: 'banner_url_Value',
//     variation: 'variation_Value',
//     invoice_id: 'invoice_id_Value',
//     company_name: 'company_name_Value',
//     company_address: 'company_address_Value',
//   },
// });

// console.log(result);
//   return new Response('Hello world!');
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Load feature flags
  const gbContext = getServerSideGrowthBookContext();
  const gb = new GrowthBook(gbContext);
  await gb.loadFeatures();

  res.status(200);
}
