import React, { FC, ReactElement, useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import {
  View,
  ActivityIndicator,
  Modal,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import type { Props } from './utils/interface';
import { transFormCard } from './utils/utils';
import PaystackFee from './utils/customerCharge';
const { height, width } = Dimensions.get('window');

const Index: FC<Props> = (props): JSX.Element => {
  // const PAYSTACK_CLOSE_URL = 'https://standard.paystack.co/close';
  const [totalAmount, setTotalAmount] = useState(props.amount);

  useEffect(() => {
    if (props.passChargeToCustomer) {
      let amount = parseInt(props.amount);
      var fees = new PaystackFee();
      const charge = fees.calculateFee(amount);
      const total = amount + charge;
      setTotalAmount(total.toString());
    } else {
      setTotalAmount(props.amount);
    }
  }, []);

  const onMessageReceived = (data: any) => {
    const paymentResponse = JSON.parse(data);
    if (props.onPaymentSuccess) props.onPaymentSuccess(paymentResponse);
  };

  const renderLoader = (): ReactElement => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
        }}
      >
        <View
          style={{
            height: height * 0.75,
            backgroundColor: '#E7EAEF',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width * 0.9,
            borderRadius: 10,
          }}
        >
          <View style={{ marginTop: height * 0.2 }}>
            <Image
              style={{ width: 45, height: 45, resizeMode: 'contain' }}
              source={{
                uri: 'https://public-files-paystack-prod.s3.eu-west-1.amazonaws.com/integration-logos/3c2534y84l5k9l0dloty.png',
              }}
            />
          </View>
          <View
            style={{
              marginBottom: 45,
              marginTop: -30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 15, marginBottom: 15 }}>
              Loading payment page.
            </Text>
            <Text
              style={{ fontSize: 14, textAlign: 'center', marginBottom: 20 }}
            >
              Please wait....
            </Text>
            <ActivityIndicator size="large" color="green" />
          </View>
        </View>
      </View>
    );
  };

  const paymentForm = `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Paystack</title>
        </head>
          <body  onload="payWithPaystack()">
            <script src="https://js.paystack.co/v2/inline.js"></script>
            <script type="text/javascript">
              window.onload = payWithPaystack;
              function payWithPaystack(){
                const paystack = new PaystackPop();
                paystack.newTransaction({
                key: '${props.publicKey}',
                email: '${props.email}',
                firstname: '${props.firstName}',
                lastname: '${props?.lastName}',
                label:'${props.firstName || props.lastName || props.email}',
                phone: '${props.phone}',
                amount: ${totalAmount},
                currency: '${props.currency}',
                ref:'${props.tranxRef}',
                ${transFormCard(props.paymentChannels)},
                metadata: {
                custom_fields: [
                        {
                        display_name:  '${
                          props.firstName + ' ' + props.lastName
                        }',
                        variable_name:  '${props.firstName}',
                        value:''
                        }
                ]},
                onSuccess: (responseObj)=>{
                 const paymentResponse = {
                    status: responseObj.status,
                    reference: responseObj.reference,
                    transactionId: responseObj.transaction,
                    trxref: responseObj.trxref,
                    message: responseObj.message,
                  };
                window.ReactNativeWebView.postMessage(JSON.stringify(paymentResponse))
                },
                onCancel:()=>{
                    var response = {status:'Cancelled',message:'Payment cancelled'};
                    window.ReactNativeWebView.postMessage(JSON.stringify(response))
                }

                });
                }
            </script>
          </body>
      </html>`;

  return (
    <Modal transparent={true} visible={true} animationType="slide">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flex: 1, ...props.containerStyle }}>
          <WebView
            originWhitelist={['*']}
            javaScriptEnabled={true}
            source={{ html: paymentForm }}
            renderLoading={renderLoader}
            startInLoadingState={true}
            onMessage={(e) => {
              onMessageReceived(e.nativeEvent?.data);
            }}
            scrollEnabled={false}
            onLoadEnd={() => {
              console.log('Load Ends');
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Index;

Index.propTypes = {
  publicKey: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  phone: PropTypes.string,
  tranxRef: PropTypes.string.isRequired,
  paymentChannels: PropTypes.string.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
  passChargeToCustomer: PropTypes.bool,
};
