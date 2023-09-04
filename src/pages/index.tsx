/* eslint-disable @typescript-eslint/no-use-before-define */

import { FormEvent, useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { useIdsStore } from '@/hooks/useIdsStore';
import { BUSINESS_IDS, INVOICE_IDS } from '@/utils/constants';
import { TRACKER_NAME } from '@/utils/snowplow';
import { useFeatureValue, useGrowthBook } from '@growthbook/growthbook-react';
import { trackStructEvent } from '@snowplow/browser-tracker';
import { CountrySelect } from '@/components/CountrySelect';
import { useCountryStore } from '@/hooks/useCountryStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

type BannerUrl = {
  en: {
    url: string;
    redirection_url: string;
  };
  id: {
    url: string;
    redirection_url: string;
  };
};

type BannerControlDetails = {
  enabled: boolean;
  banner_url?: BannerUrl;
};

type EmailBannerControlDetails = {
  enabled: boolean;
  banner_url?: BannerUrl;
  email_template_ids?: {
    en: {
      product: string;
    };
    id: {
      product: string;
    };
  };
};
type BannerControlProps = {
  placement_pre: BannerControlDetails;
  placement_post: BannerControlDetails;
  placement_email: EmailBannerControlDetails;
};

const generateRandomNumber = () => {
  const numberRange = 100;
  return Math.floor(Math.random() * numberRange);
};

export default function Home() {
  const growthbookHook = useGrowthBook();
  const {
    i18n: { language: selectedLanguage },
  } = useTranslation();
  const { selectedCountry } = useCountryStore();
  const [RANDOMISING_INDEX, setRandomisingIndex] = useState<number>(0);
  const { INVOICE_ID, BUSINESS_ID, setBusinessId, setInvoiceId } =
    useIdsStore();

  useEffect(() => {
    setRandomisingIndex(generateRandomNumber);
  }, []);

  const bannerControls: BannerControlProps | Record<string, never> =
    useFeatureValue('nex_card_banner_v2', {}); //growthbook

  const updateIds = useCallback(() => {
    setBusinessId(BUSINESS_IDS[RANDOMISING_INDEX]);
    setInvoiceId(INVOICE_IDS[RANDOMISING_INDEX]);
  }, [RANDOMISING_INDEX, setBusinessId, setInvoiceId]);

  const setGrowthBookAttributes = useCallback(() => {
    if (!growthbookHook || !selectedCountry) return;
    growthbookHook.setAttributes({
      businessId: BUSINESS_ID, // Configured for ForceValue
      invoiceId: INVOICE_ID, // Using for hash assignment for experiment
      countryOfOperation: selectedCountry.value,
    });
  }, [INVOICE_ID, BUSINESS_ID, growthbookHook, selectedCountry]);

  useEffect(() => {
    updateIds();
  }, [updateIds]);

  /**
   * WARNING setAttributes cannot have other dependents, should
   * just contain the items it need like invoiceId and businessId
   */
  useEffect(() => {
    setGrowthBookAttributes();
  }, [setGrowthBookAttributes]);

  if (!selectedLanguage) {
    console.log('Language Loading');
    return <Spinner />;
  }
  return (
    <>
      <Toaster />
      <main className="mx-8 my-12">
        <LanguageSwitcher />
        <CountrySelect />
        <div className="mb-4">
          <h3 className=""> BUSINESS ID: {BUSINESS_ID}</h3>
          <h3 className=""> INVOICE ID: {INVOICE_ID}</h3>
        </div>
        {Object.entries(bannerControls).length > 0 ? (
          <div className="space-y-4">
            {(bannerControls.placement_pre as BannerControlDetails).enabled ? (
              <BannerCard
                invoiceId={INVOICE_ID}
                title="Placement Pre"
                {...(bannerControls.placement_pre as BannerControlDetails)}
              />
            ) : (
              <p>Placement Pre is not enabled</p>
            )}
            {(bannerControls.placement_post as BannerControlDetails).enabled ? (
              <BannerCard
                invoiceId={INVOICE_ID}
                title="Placement Post"
                {...(bannerControls.placement_post as BannerControlDetails)}
              />
            ) : (
              <p>Placement Pre is not enabled</p>
            )}
            {(bannerControls.placement_email as EmailBannerControlDetails)
              .enabled ? (
              <EmailBannerCard
                invoiceId={INVOICE_ID}
                title="Placement Email"
                {...(bannerControls.placement_email as EmailBannerControlDetails)}
              />
            ) : (
              <p>Placement Pre is not enabled</p>
            )}
          </div>
        ) : (
          <Spinner />
        )}
      </main>
    </>
  );
}

const BannerCard = (
  props: BannerControlDetails & {
    title: string;
    invoiceId: string;
  },
) => {
  const { banner_url, title, invoiceId } = props;
  const {
    i18n: { language },
  } = useTranslation();
  const selectedLanguage = (language === 'en-US' ? 'en' : language) as
    | 'en'
    | 'id';
  const handleBannerClick = (bannerUrl: string) => {
    toast.success('Banner Clicked');
    trackStructEvent(
      {
        action: 'Banner Clicked',
        category: invoiceId,
        label: bannerUrl,
      },
      [TRACKER_NAME],
    );
  };

  console.log('BannerCard Rendered', {
    banner_url,
    selectedLanguage,
  });
  return (
    <div className="p-4 border border-gray-600 rounded-md">
      <Toaster />
      <h1 className="text-xl">{title}</h1>
      <div>
        <p>Properties</p>
        <pre className="whitespace-break-spaces">
          {JSON.stringify({ banner_url }, null, 2)}
        </pre>
      </div>
      <div>
        <p>Items</p>
        <div className="w-40">
          <p>
            Selected Language:{' '}
            <span className="font-bold">{selectedLanguage}</span>
          </p>
          {banner_url && (
            <button
              onClick={() =>
                handleBannerClick(banner_url[selectedLanguage].url)
              }
            >
              <img src={banner_url[selectedLanguage].url} alt="meme" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EmailBannerCard = (
  props: EmailBannerControlDetails & {
    title: string;
    invoiceId: string;
  },
) => {
  const { INVOICE_ID, BUSINESS_ID } = useIdsStore();
  const { banner_url, email_template_ids, title, invoiceId } = props;
  const {
    i18n: { language },
  } = useTranslation();
  const { selectedCountry } = useCountryStore();
  const selectedLanguage = (language === 'en-US' ? 'en' : language) as
    | 'en'
    | 'id';

  const handleBannerClick = (bannerUrl: string) => {
    toast.success('Banner Clicked');
    trackStructEvent(
      {
        action: 'Banner Clicked',
        category: invoiceId,
        label: bannerUrl,
      },
      [TRACKER_NAME],
    );
  };

  console.log('EmailBannerCard Rendered', {
    banner_url,
    selectedLanguage,
  });

  const sendEmail = async (e: any) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
      const result = await fetch('api/send-email', {
        method: 'POST',
        body: JSON.stringify({
          invoiceId: INVOICE_ID,
          businessId: BUSINESS_ID,
          locale: selectedLanguage,
          emailAddress: formData.get('emailInput'),
          countryOfOperation: selectedCountry?.value,
        }),
      });
      toast.success(result.status.toString());
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return (
    <div className="p-4 border border-gray-600 rounded-md">
      <Toaster />
      <h1 className="text-xl">{title}</h1>

      <form onSubmit={sendEmail} className="space-x-2">
        <label>
          Email input:{' '}
          <input
            className="border border-black"
            name="emailInput"
            defaultValue=""
          />
        </label>
        <button type="submit" className="p-2 border rounded-md cursor-pointer">
          Send Email
        </button>
      </form>

      <div>
        <p>Properties</p>
        <pre className="whitespace-break-spaces">
          {JSON.stringify({ banner_url, email_template_ids }, null, 2)}
        </pre>
      </div>
      <div>
        <p>Items</p>
        <div className="w-40">
          <p>
            Selected Language:{' '}
            <span className="font-bold">{selectedLanguage}</span>
          </p>
          {banner_url && (
            <>
              <button
                onClick={() =>
                  handleBannerClick(banner_url[selectedLanguage].url)
                }
              >
                <img src={banner_url[selectedLanguage].url} alt="meme" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const Spinner = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 mr-2 text-black animate-spin fill-yellow-400"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
