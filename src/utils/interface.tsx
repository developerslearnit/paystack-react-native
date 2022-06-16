import type { ReactElement } from 'react';

interface Props {
  publicKey: string;
  amount: string;
  currency: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tranxRef: string;
  paymentChannels: string;
  showPaymentPopup: boolean;
  onPaymentSuccess: (response: any) => void;
}

export { Props };
