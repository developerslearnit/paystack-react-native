# @devlearn/paystack-react-native

A Paystack React Native SDK that allows you to build delightful payment experience in your native Android and IOS apps with React Native.

## Installation

```sh
npm install @devlearn/paystack-react-native
```

## Usage

```js
import * as React from 'react';
import Contstants from 'expo-constants';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import PayStackPay from '@devlearn/paystack-react-native';
import { Feather } from '@expo/vector-icons';

export default function App() {
  const { width, height } = Dimensions.get('window');
  const statusBarHieght = Contstants.statusBarHeight;
  const [showPaymentPopup, setShowPaymentPopup] = React.useState(false);
  const [showMessageBox, setShowMessageBox] = React.useState(false);
  const [transRef, setTransRef] = React.useState('');

  //Sample Order Details
  var orderInfo = {
    amount: 5000 * 100,
    email: 'customer@someeail.com',
    firstName: 'John',
    lastName: 'Doe',
    publicKey: 'pk_test_4cdd4b1e6g52633f9e0800f1e55b89db3beea6d9',
  };

  const handlePaymentSuccess = async (response: any) => {
    //handle transaction processing
    // {
    //   "message": "Approved",
    //   "reference": "1234XXXXXX",
    //   "status": "success",
    //   "transactionId": "1891204959",
    //   "trxref": "1234XXXXXX",
    // }
    console.log('response', response);

    /* To verify the transaction, you have to set up a route or page on your server
      that you pass the transaction reference to. Then from your server, you call the Paystack verify
      endpoint to confirm the status of the transaction, and the response is returned to your frontend.
      Never call the Paystack API directly from your frontend to avoid exposing your secret key on the frontend

    const transactionStatusRequest =  await fetch(`https://your.api.url/transaction/status/${response.reference}`);
    const transactionStatusJson = await transactionStatusRequest.json();

    if(transactionStatusJson.status === 'success') {
      // transaction was successful
       setShowPaymentPopup(false);
       setShowMessageBox(true);
    }else{
     setShowPaymentPopup(false);
    setShowMessageBox(true);
    }
*/
    setShowPaymentPopup(false);
    setShowMessageBox(true);
  };

  const SuccessModal = () => {
    return (
      <Modal transparent={true} animationType="slide">
        <View
          style={{
            backgroundColor: '#000',
            flex: 1,
            opacity: 0.7,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: statusBarHieght + 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              height: height * 0.6,
              width: width * 0.85,
              borderRadius: 5,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                letterSpacing: 10,
                fontWeight: '900',
                fontSize: 14,
                marginBottom: 60,
              }}
            >
              PAYMENT SUCCESS
            </Text>
            <Feather name="check-circle" size={53} color="#3CD27D" />
            <Text style={{ fontSize: 19, marginTop: 25, marginBottom: 10 }}>
              Your payment was successful
            </Text>
            <Text style={{ fontSize: 15, color: '#333', marginBottom: 20 }}>
              Payment Ref {transRef}
            </Text>
            <View
              style={{
                borderBottomColor: '#3CD27D',
                borderBottomWidth: 1,
                height: 10,
                width: width * 0.4,
                marginBottom: 30,
              }}
            ></View>
            <Text>Rate your purchase</Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'column',
                height: height * 0.13,
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  paddingHorizontal: 30,
                  paddingVertical: 12,
                  borderRadius: 5,
                }}
                onPress={() => setShowMessageBox(false)}
              >
                <Text>BACK TO HOME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: '#62678C',
          paddingVertical: 15,
          paddingHorizontal: 50,
          borderRadius: 5,
        }}
        onPress={() => {
          setTransRef(`ref-${Math.floor(Math.random() * 1000000)}`);
          setShowPaymentPopup(true);
        }}
      >
        <Text style={{ color: '#3CD27D', fontSize: 14 }}>
          Pay NGN {(orderInfo.amount / 100).toFixed(2)}
        </Text>
      </TouchableOpacity>

      {/* MessageBox */}

      {showMessageBox && <SuccessModal />}

      {/* Check for showpayemt popup state here*/}
      {showPaymentPopup && (
        <PayStackPay
          amount={orderInfo.amount.toString()}
          currency="NGN"
          email={orderInfo.email}
          paymentChannels="card"
          publicKey={orderInfo.publicKey}
          firstName={orderInfo.firstName}
          lastName={orderInfo.lastName}
          onPaymentSuccess={handlePaymentSuccess}
          tranxRef={transRef}
          passChargeToCustomer={true}
          containerStyle={{
            backgroundColor: 'white',
            padding: 0,
            width: width * 0.95,
            height: height * 0.8,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202442',
  },
});
```

## Props

| Prop                 | Description                                                                                                                                                                        | Type     | Required | Default      |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :------- | :----------- |
| amount               | Amount to be paid by the customer multiply by 100                                                                                                                                  | string   | true     | 0            |
| currency             | Currency in which charge should done .Allowed values are: NGN, GHS, ZAR or USD                                                                                                     | string   | true     | null         |
| email                | Customer's email address                                                                                                                                                           | string   | true     | null         |
| paymentChannels      | The channels in which should be available for the customer to make payment. To be passed in comma separated e.g. 'card', 'bank', 'ussd'                                            | string   | true     | null         |
| publicKey            | Your public key from Paystack. Use test key for test mode and live key for live mode                                                                                               | string   | true     | null         |
| firstName            | The first name of the customer                                                                                                                                                     | string   | false    | null         |
| lastName             | The last name of the customer                                                                                                                                                      | string   | false    | null         |
| onPaymentSuccess     | The function that is called when payment is completed. This is where you can call a backend server to verify transaction                                                           | function | true     | null         |
| tranxRef             | Unique case sensitive transaction reference. Only -,., =and alphanumeric characters allowed. If you do not pass this parameter, Paystack will generate a unique reference for you. | string   | true     | randomnumber |
| passChargeToCustomer | Flag to indicate if paystack charge should be paid by the customer. If set to true, paystack charge will be calculated and will be added to the customer payable amount.           | boolean  | false    | false        |
| containerStyle       | This allow you to apply custom style to suite your app customer                                                                                                                    | object   | false    | null         |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
