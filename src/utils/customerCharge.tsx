const DEFAULT_PERCENTAGE = 0.015;
const DEFAULT_ADDITIONAL_CHARGE = 10000;
const DEFAULT_THRESHOLD = 250000;
const DEFAULT_CAP = 200000;

class PaystackFee {
  constructor() {}

  get chargeDivider() {
    return 1 - DEFAULT_PERCENTAGE;
  }

  get crossover() {
    return DEFAULT_THRESHOLD * this.chargeDivider - DEFAULT_ADDITIONAL_CHARGE;
  }

  get flatlinePlusCharge() {
    return (DEFAULT_CAP - DEFAULT_ADDITIONAL_CHARGE) / DEFAULT_PERCENTAGE;
  }

  get flatline() {
    return this.flatlinePlusCharge - DEFAULT_CAP;
  }

  calculateFee(amount: number) {
    const flat = amount > DEFAULT_THRESHOLD ? DEFAULT_ADDITIONAL_CHARGE : 0;
    const fees = Math.ceil(DEFAULT_PERCENTAGE * amount + flat);
    return Math.min(fees, DEFAULT_CAP);
  }
}

export default PaystackFee;
