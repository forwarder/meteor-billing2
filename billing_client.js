var helpers = {
  
  hasFeature: function(feature) {
  	var subscriber = Billing.subscriber()
  		, comma = (feature || '').indexOf(','),
        features

    if (!subscriber || !subscriber.subscription) return false;
    if (!Match.test(feature, String)) return false;

    if (comma !== -1) {
      features = _.reduce(feature.split(','), function (memo, f) {
        if (!f || !f.trim()) {
          return memo;
        }
        memo.push(f.trim());
        return memo;
      }, []);
    } else {
      features = [feature];
    }

    return Billing.hasFeatures(subscriber.subscription, features);
  },
  
  priceForFeature: function(feature) {
  	var subscriber = Billing.subscriber();
    if (!subscriber || !subscriber.subscription) return false;
    
    return accounting.formatMoney(Billing.priceForFeature(subscriber.subscription, feature));
  },
  
  unitPriceForFeature: function(feature) {
  	var subscriber = Billing.subscriber();
    if (!subscriber || !subscriber.subscription) return false;
    
    return accounting.formatMoney(Billing.unitPriceForFeature(org, feature));
  },
  
  hasSubscription: function() {
  	var subscriber = Billing.subscriber();
    if (!subscriber || !subscriber.subscription) return false;
    
    return  Billing.getSubscription(subscriber.subscription) ? true : false;
  }
  
}

if(Package.ui) {
  _.each(helpers, function(helper, name) {
    Package.ui.Handlebars.registerHelper(name, helper);
  });
}