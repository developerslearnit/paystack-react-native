import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import PayStackPay from '@devlearn/paystack-react-native';

export default function App() {
  const handlePaymentSuccess = (response: any) => {
    console.log('response', response);
  };

  const amount = `${5000 * 100}`;

  //    {
  //   "message": "Approved",
  //   "reference": "07085051295",
  //   "status": "success",
  //   "transactionId": "1891204959",
  //   "trxref": "07085051295",
  // }

  //  {
  //   "message": "Payment cancelled",
  //   "status": "cancelled",
  // }

  return (
    <View style={styles.container}>
      <PayStackPay
        amount={amount}
        currency="NGN"
        email="mark2kk@gmail.com"
        paymentChannels="card,ussd,bank"
        publicKey="pk_test_4cdd4b1e6e52633f9e0800f1e22b89db3beea6d9"
        onPaymentSuccess={handlePaymentSuccess}
        tranxRef="85051299"
        firstName="Mark"
        lastName="Omoniyi"
        phone="07085051225"
        showPaymentPopup={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
