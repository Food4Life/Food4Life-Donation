var React = require('react');

var simplePaypal = React.createClass({
  componentDidMount: function() {
    var currencySymbol = this.props.currencySymbol;
    // ***********************************************
    // Update Donate button to make it show the selected donation amount
    // ***********************************************
    var $theForm = $('#primary-form');

    $theForm.find('[name="donation_amount_other"]').val("");

    function updateDonateButtonText(amountSelected) {
      var buttonText = amountSelected ? "Donate " + currencySymbol + "{ amount } now".replace("{ amount }", amountSelected) : "Donate now";
      $("#donate-btn").text(buttonText);
      $('#paypal-one-time').find('[name="amount"]').attr('value', amountSelected);
      $('#paypal-recurring').find('[name="a3"]').attr('value', amountSelected);
    }

    function updateDonateButtonTextEvent(event) {
      var amountSelected = $(this).val();
      updateDonateButtonText(amountSelected);
    }

    // check if a pre-selected amount is passed via the URL
    if (window.location.hash.match(/#amount-\d+?/)) {
      var preSelected = window.location.hash.substring(8);
      $theForm.find('[name="donation_amount_other"]').val(preSelected);
      updateDonateButtonText(preSelected);
    }

    $theForm.find('[name="donation_amount_other"]').keyup(updateDonateButtonTextEvent);
    $theForm.find('[name="donation_amount_other"]').keydown(function (event) {
      var functionKeys = [46, 8, 9, 27, 13, 110, 190]; // backspace, delete, tab, escape, enter and .
      var numberKeys = [ 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105 ]; // numbers
      var allowed = functionKeys.concat(numberKeys);
      if (allowed.indexOf(event.keyCode) === -1) {
        event.preventDefault();
      }
    });

    $('input#amount-other + label + input[type="number"]').focus(function () {
      $(this).prevAll('input[type="radio"]').click();
    });

    // ***********************************************
    // Catch the form submission and send off the appropriate donation type
    // ***********************************************

    $theForm.on('submit', function (e) {
      e.preventDefault();

      if ($('input[name="recurring_acknowledge"]:checked').val() === '0') {
        $('#paypal-one-time').submit();
      } else {
        $('#paypal-recurring').submit();
      }
    });
  },
  render: function() {
    return (
      <div className="simple-paypal">
        <div id="header-copy">
          <h1>Donate now</h1>
        </div>
        <div id="form-wrapper" className="container">
          <div className="wrap">
            <div className="row">
              <img src="https://sendto.mozilla.org/page/-/paypal_logo@2x.png" alt="PayPal Logo" width="140" height="58"/>

              <p id="secure-label"><i className="fa fa-lock"></i>Secure</p>
            </div>

            <div className="row">
              <div className="full">
                <h4>
                  Select your donation amount
                </h4>
              </div>
            </div>
            <form action="#" id="primary-form">
              <div className="row donation-amount-row">
                <div className="full">
                  <div id="amount-other-container">
                    <input type="radio" name="donation_amount" value="other" id="amount-other"/>
                    <label htmlFor="amount-other" className="large-label-size">{this.props.currency}</label>
                    <input x-moz-errormessage="Please select a value that is no less than 2." type="number" name="donation_amount_other" min={this.props.minAmount} placeholder="Amount" className="medium-label-size" required/>
                  </div>
                </div>
              </div>
              <div className="row" id="recurring-option-row">
                <div className="half">
                  <input type="radio" name="recurring_acknowledge" defaultChecked="checked" value="0" required id="one-time-payment"/><label htmlFor="one-time-payment" className="medium-label-size">One-time</label>
                </div>
                <div className="half">
                  <input type="radio" name="recurring_acknowledge" value="1" required id="monthly-payment"/><label htmlFor="monthly-payment" className="medium-label-size">Monthly</label>
                </div>
              </div>
              <div className="row">
                <div className="full">
                  <button type="submit" className="btn large-label-size" id="donate-btn">
                    Donate now
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <p className="donation-notice">
            <small>Contributions go to the Mozilla Foundation, a 501(c)(3) organization, to be used in its discretion for its charitable purposes. They are tax-deductible in the U.S. to the fullest extent permitted by law.</small>
          </p>
        </div>

        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" id="paypal-one-time">
          <input type="hidden" name="cmd" value="_donations"/>
          <input type="hidden" name="business" value="44ZHAVWJHTK2N"/>
          <input type="hidden" name="lc" value={this.props.paypalLocal}/>
          <input type="hidden" name="item_name" value="Mozilla Foundation"/>
          <input type="hidden" name="no_note" value="1"/>
          <input type="hidden" name="no_shipping" value="1"/>
          <input type="hidden" name="rm" value="1"/>
          {/* Donation Amount */}
          <input type="hidden" name="amount" value="0"/>
          <input type="hidden" name="return" value="https://sendto.mozilla.org/page/s/EOYFR2014-donor"/>
          <input type="hidden" name="currency_code" value={this.props.currency}/>
        </form>

        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" id="paypal-recurring">
          <input type="hidden" name="cmd" value="_xclick-subscriptions"/>
          <input type="hidden" name="business" value="44ZHAVWJHTK2N"/>
          <input type="hidden" name="lc" value={this.props.paypalLocal}/>
          <input type="hidden" name="item_name" value="Mozilla Foundation Recurring Donation"/>
          <input type="hidden" name="no_note" value="1"/>
          <input type="hidden" name="no_shipping" value="2"/>
          <input type="hidden" name="return" value="https://sendto.mozilla.org/page/s/EOYFR2014-donor"/>
          <input type="hidden" name="src" value="1"/>
          <input type="hidden" name="p3" value="1"/>
          <input type="hidden" name="currency_code" value={this.props.currency}/>
          <input type="hidden" name="t3" value="M"/>
          <input name="srt" type="hidden" value="0"/>
          <input type="hidden" name="a3" value="0"/>

        </form>
      </div>
    )
  }
});

module.exports = simplePaypal;
