import { showNotification } from '../common/APIComponents';

export const loadRazorpayScript = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const createOrder = async amount => {
  const response = await fetch(
    'https://api.semprep.com/api/create-order',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.max(100, Math.round(amount * 100)),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to create order');
  }

  return data?.data;
};

const verifyPayment = async response => {
  const verifyResp = await fetch(
    'https://api.semprep.com/api/verify-payment',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      }),
    }
  );

  return verifyResp.json();
};

export const triggerRazorpay = async ({
  amount,
  name,
  email,
  contact,
  order_id,
  notes = {},
  onSuccess = () => {},
  onFailure = () => {},
  onCancel = () => {},
  onOpen = () => {},
  onBeforeOpen = () => {},
  testMode = true,
}) => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    console.error('Razorpay SDK failed to load.');
    onFailure({ message: 'Unable to load Razorpay SDK' });
    return;
  }

  if (!amount || !name || !email) {
    console.error('Missing required payment parameters');
    showNotification({
      type: 'error',
      message: `Missing required payment parameters ${amount ? '' : 'amount'} ${
        name ? '' : 'name'
      } ${email ? '' : 'email'}`,
    });
    onFailure({ message: 'Missing required payment details' });
    return;
  }

  let orderData = null;
  if (!order_id) {
    try {
      orderData = await createOrder(amount);
    } catch (error) {
      console.error('Order creation failed:', error);
      showNotification({
        type: 'error',
        message: error?.message || 'Unable to create payment order',
      });
      onFailure(error);
      return;
    }
  }

  const key = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';

  onBeforeOpen?.();

  const options = {
    key,
    amount: orderData?.amount || amount * 100,
    currency: orderData?.currency || 'INR',
    name: 'semprep',
    description: 'Cart Payment',
    order_id: order_id || orderData?.order_id,
    handler: async function (response) {
      if (!response?.razorpay_payment_id) {
        onFailure({ message: 'Payment response invalid' });
        return;
      }

      try {
        const verifyData = await verifyPayment(response);
        if (verifyData?.success) {
          onSuccess({
            payload: {
              payment: {
                id: response.razorpay_payment_id,
              },
            },
          });
        } else {
          throw new Error(verifyData?.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Verification failed:', err);
        showNotification({
          type: 'error',
          message: err?.message || 'Payment verification failed',
        });
        onFailure(err);
      }
    },
    prefill: {
      name,
      email,
      contact,
    },
    notes,
    theme: {
      color: '#1e3a8a',
    },
    modal: {
      ondismiss: function () {
        onCancel();
      },
    },
    retry: {
      enabled: true,
      max_count: 3,
    },
    timeout: 600,
  };

  try {
    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      onFailure(response?.error || response);
    });

    rzp.on('modal.open', function () {
      onOpen();
    });

    rzp.open();
  } catch (error) {
    console.error('Error triggering Razorpay:', error);
    onFailure({
      message: 'Something went wrong while opening Razorpay',
      error,
    });
  }
};
