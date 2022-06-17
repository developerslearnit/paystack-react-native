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
  passChargeToCustomer?: boolean;
  containerStyle?: any;
  onPaymentSuccess: (response: any) => void;
}

export { Props };
