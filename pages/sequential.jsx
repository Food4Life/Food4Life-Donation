import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SmallPrint from '../components/small-print.jsx';
import SectionHeading from '../components/section-heading.jsx';
import CurrencyDropdown from '../components/currency-dropdown.jsx';

import NavigationMenu from '../components/navigation-menu.jsx';
import NavigationButton from '../components/navigation-button.jsx';
import NavigationContainer from '../components/navigation-container.jsx';
import NextButton from '../components/next-button.jsx';
import Page from '../components/navigation-page.jsx';
import SubmitButton from '../components/submit-button.jsx';
import DonateButton from '../components/donate-button.jsx';
import PayPalButton from '../components/paypal-button.jsx';
import CreditCardButton from '../components/credit-card-button.jsx';

import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import CrediCardInfo from '../components/credit-card-info.jsx';
import Name from '../components/name-input.jsx';
import {FullAddress, PartialAddress} from '../components/address-input.jsx';
import Email from '../components/email-input.jsx';
import {PrivacyPolicyCheckbox, SignupCheckbox} from '../components/checkbox.jsx';

import IntlMixin from 'react-intl';

module.exports = React.createClass({
  mixins: [IntlMixin, require('../mixins/form.jsx')],
  getInitialState() {
    return {
      activePage: 0,
      hideCreditCardDetails: true,
      height: ""
    };
  },
  expandCreditCardInfo: function() {
    this.setState({
      hideCreditCardDetails: false
    });
    this.setState({
      paymentType: this.getIntlMessage('credit_card')
    });
    window.setTimeout(this.refs.creditCardInfoField.focus, 500);
    this.updateHeight();
  },
  collapseCreditCardInfo: function() {
    this.setState({
      hideCreditCardDetails: true
    });
    this.setState({
      paymentType: "PayPal"
    });
    this.updateHeight();
  },
  renderSubmitButton: function(data) {
    var amount = this.state.props.amount.values.amount;
    var currency = this.state.currency;
    return (
      <SubmitButton
        submitting={this.state.submitting}
        validate={data.validate}
        onSubmit={this.stripe}
        submit={data.submit}
        error={this.state.errors.other}
      >
        <DonateButton
          amount={amount} currency={currency.code}
        />
      </SubmitButton>
    );
  },
  render: function() {
    var creditCardDetailsClassName = "row credit-card-section";
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    if (this.state.hideCreditCardDetails) {
      creditCardDetailsClassName += " hidden";
    }
    var amount = this.state.props.amount.values.amount;
    var currency = this.state.currency;
    return (
      <div className={className}>
        <Header/>
        <div className="container">

          <NavigationMenu>
            <NavigationButton amount={amount} currency={currency.code} onClick={this.toThisPage} activePage={this.state.activePage} index={0}>
              <div>{this.getIntlMessage("amount")}</div>
            </NavigationButton>
            <NavigationButton display={this.state.paymentType} onClick={this.toThisPage} activePage={this.state.activePage} index={1}>
              <div>{this.getIntlMessage("payment")}</div>
            </NavigationButton>
            <NavigationButton activePage={this.state.activePage} index={2}>
              <div>{this.getIntlMessage("personal")}</div>
            </NavigationButton>
          </NavigationMenu>

          <NavigationContainer height={this.state.height}>
            <Page activePage={this.state.activePage} index={0}>
              <SectionHeading>
                <h2>
                  {this.getIntlMessage("donate_now")}
                  <span className="right">
                    <CurrencyDropdown
                      currencies={this.props.currencies}
                      currency={currency.code}
                      onChange={this.onCurrencyChanged}
                    />
                  </span>
                </h2>
              </SectionHeading>
              <AmountButtons name="amount"
                currency={currency}
                onChange={this.updateFormField}
                amount={amount} presets={this.state.presets}
              />
              <Frequency onChange={this.onFrequencyChange} name="frequency" value={this.state.props.frequency.values.frequency}/>
              <NextButton onClick={this.nextPage} validate={["amount"]}/>
            </Page>

            <Page activePage={this.state.activePage} index={1} onError={this.onPageError} errors={[this.state.errors.creditCardInfo]}>
              <SectionHeading>
                <h2>{this.getIntlMessage("choose_payment")}</h2>
                <p id="secure-label">
                  <i className="fa fa-lock"></i>{this.getIntlMessage('secure')}
                </p>
              </SectionHeading>
              <div className="row">
                <CreditCardButton onClick={this.expandCreditCardInfo}/>
                <PayPalButton
                  submit={["frequency", "amount"]}
                  onSubmit={this.paypal}
                  onClick={this.collapseCreditCardInfo}
                />
              </div>
              <div className={creditCardDetailsClassName}>
                <CrediCardInfo error={this.state.errors.creditCardInfo}
                  onChange={this.onChange} name="creditCardInfo" ref="creditCardInfoField"
                />
                <NextButton onClick={this.nextPage} validate={["creditCardInfo"]}/>
              </div>
            </Page>

            <Page activePage={this.state.activePage} index={2} onError={this.onPageError} errors={[this.state.errors.address, this.state.errors.other]}>
              <SectionHeading>
                <h2>{this.getIntlMessage("personal")}</h2>
              </SectionHeading>
              <Name onChange={this.onChange} name="name"/>
              <div className="base-line-address">
                <FullAddress
                  onChange={this.onChange}
                  name="address-full"
                  error={this.state.errors.address}
                />
              </div>
              <div className="partial-address">
                <PartialAddress
                  onChange={this.onChange}
                  name="address-partial"
                  error={this.state.errors.address}
                />
              </div>
              <Email onChange={this.onChange} name="email" info={this.getIntlMessage("email_info")}/>
              <PrivacyPolicyCheckbox onChange={this.onChange} name="privacyPolicy"/>
              <SignupCheckbox onChange={this.onChange} name="signup"/>

              <div className="base-line-address">
                {this.renderSubmitButton({
                  validate: ["name", "address-full", "email", "privacyPolicy"],
                  submit: ["amount", "frequency", "creditCardInfo", "name", "address-full", "email", "signup"]
                })}
              </div>
              <div className="partial-address">
                {this.renderSubmitButton({
                  validate: ["name", "address-partial", "email", "privacyPolicy"],
                  submit: ["amount", "frequency", "creditCardInfo", "name", "address-partial", "email", "signup"]
                })}
              </div>
            </Page>
          </NavigationContainer>

        </div>
        <SmallPrint stripeNotice={!this.state.hideCreditCardDetails}/>
        <Footer/>
      </div>
    );
  }
});
