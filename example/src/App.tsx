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
    publicKey: 'pk_test_4cdd4b1e6e52633f9e08xxxx',
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
