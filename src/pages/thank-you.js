import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Signup from '../components/signup.js';
import Social from '../components/social.js';
import ThankYouHeader from '../components/thank-you-header.js';
import analytics from '../lib/analytics.js';
import MonthlyUpgrade from '../components/monthly-upgrade.js';
import locationSearchParser from '../lib/location-search-parser.js';
import amountModifier from '../lib/amount-modifier.js';
import suggestMonthly from '../lib/suggest-monthly.js';

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    let query = locationSearchParser(this.props.location);
    if (query && navigator.cookieEnabled) {
      if (query.str_frequency === "one-time") {
        let trueAmount = amountModifier.reverse(
          query.str_amount,
          query.payment.toLowerCase(),
          query.str_currency
        );
        let suggestedMonthly = suggestMonthly(trueAmount, query.str_currency);
        if (suggestedMonthly) {
          return {
            showMonthlyUpgrade: true,
            suggestedMonthly,
            currencyCode: query.str_currency
          };
        }
      }
    }
    return {
      showMonthlyUpgrade: false,
      showThankyouPage: false
    };
  },
  componentDidMount: function() {
    analytics();
    this.setState({
      showThankyouPage: true
    });
  },
  closeMonthlyUpgrade: function() {
    this.setState({
      showMonthlyUpgrade: false
    });
  },
  render: function() {
    var className = "row thank-you-page";
    var signUpOrSocial = (<Social/>);
    var monthlyUpgrade = null;
    var subscribed = this.props.subscribed;
    if (this.state.showMonthlyUpgrade) {
      monthlyUpgrade = (
        <MonthlyUpgrade
          currencyCode={this.state.currencyCode}
          onClose={this.closeMonthlyUpgrade}
          suggestedMonthly={this.state.suggestedMonthly}
        />
      );
    }
    if (/^(en|de|es|fr|pl|pt-BR)(\b|$)/.test(this.context.intl.locale) && subscribed !== "1") {
      signUpOrSocial = (<Signup country={this.props.country}/>);
    }
    var thankYouPage = null;
    var containerClass = "";
    if (this.state.showThankyouPage) {
      thankYouPage = (
        <div>
          <ThankYouHeader/>
          {monthlyUpgrade}
          <div>
            {signUpOrSocial}
            <MozillaFooter/>
          </div>
        </div>
      );
    } else {
      containerClass += "initial-render";
    }
    return (
      <div className={containerClass}>
        <div className={className}>
          {thankYouPage}
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
