// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
type EmailBannerControlDetails = {
  enabled: boolean;
  banner_url?: {
    en: {
      url: string;
      redirection_url: string;
    };
    id: {
      url: string;
      redirection_url: string;
    };
  };
  email_template_ids?: {
    en: {
      product: string;
    };
    id: {
      product: string;
    };
  };
};
type BannerControlDetails = {
  enabled: boolean;
  banner_id?: string;
  redirection_url?: string;
  banner_url?: string;
};

type BannerControlProps = {
  placement_pre: BannerControlDetails;
  placement_post: BannerControlDetails;
  placement_email: EmailBannerControlDetails;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { invoiceId, businessId, locale, emailAddress } = JSON.parse(req.body);

  // Load feature flags
  const gbContext = getServerSideGrowthBookContext();
  const gb = new GrowthBook(gbContext);
  await gb.loadFeatures();

  // need to have both attributes set
  gb.setAttributes({
    invoiceId,
    businessId,
  });

  const bannerControls = gb.getFeatureValue('nex_card_banner_v2', {});

  if (bannerControls) {
    const emailPlacement = (bannerControls as BannerControlProps)
      .placement_email;
    const emailTemplate =
      emailPlacement.email_template_ids?.[locale as 'en' | 'id'].product || '';

    const client = new ServerClient(POSTMARK_API_KEY ?? '');
    await client.sendEmailWithTemplate({
      From: 'shun.tan@xendit.co',
      To: emailAddress,
      TemplateId: Number(emailTemplate),
      TemplateModel: {
        product_url: 'product_url_Value',
        product_name: 'product_name_Value',
        banner_url: emailPlacement.banner_url?.[locale as 'en' | 'id'].url,
        variation: 'variation_Value',
        invoice_id: invoiceId,
        company_name: 'company_name_Value',
        company_address: 'company_address_Value',
      },
    });
  }

  res.status(200).json({});
}
