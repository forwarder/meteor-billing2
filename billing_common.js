if('undefined' === typeof Billing) {
  Billing = {}
}

var Features, Plans, Subscriptions;

Billing.Features = Features = new Meteor.Collection('features');
Billing.Plans = Subscriptions = new Meteor.Collection('plans');
Billing.Subscriptions = Subscriptions = new Meteor.Collection('subscriptions');

Meteor.startup(function() {
  if(typeof Billing.subscriber !== 'function') {
    Billing.subscriber = function() {
      return Meteor.user();
    }
  }
});

_.extend(Billing, {
  
	hasFeatures: function(subscription, features) {
		var plan;
		
		if (!_.isArray(features)) {
      features = [features];
    }

    subscription = this.findSubscription(subscription);
		
		if (!subscription || !subscription.plan) {
      return false;
    }
		
		plan = Plans.findOne({
			_id: subscription.plan,
			$or: [{
			  features: {$in: features}
			}, {
			  'features.id': {$in: features}
			}]
		});
		
		return plan ? true : false;
	},
  
  getFeature: function(subscription, feature) {    
    subscription = this.findSubscription(subscription);
    
    if(!subscription || subscription.plan) {
      return false;
    }
    
    var plan = this.findPlan(subscription);
    
    if(!plan) {
      return false;
    }
    
    return _.find(plan.features, function(f) {
      return f == feature || f.id == feature;
    });
  },
  
  findSubscription: function(subscription) {
    if ('string' == typeof subscription) {
      subscription = Subscriptions.findOne(subscription);
    }
    
    if(!subscription) {
      return false;
    }
    
    return subscription;
  },
  
  findPlan: function(plan) {
    if ('string' == typeof plan) {
      plan = Plans.findOne(plan);
    }
    
    if(!plan) {
      return false;
    }
    
    return plan;
  },
  
  priceForFeature: function(subscription, feature) {
    feature = this.getFeature(subscription, feature);

    return feature && feature.price || 0;
  },
  
  unitPriceForFeature: function(subscription, feature) {
    feature = this.getFeature(subscription, feature);

    return feature && feature.unitPrice || 0;
  },
  
  featureEnabled: function(subscription, feature) { 
    subscription = this.findSubscription(subscription);
    
    return subscription.features && _.indexOf(subscription.features, feature) !== -1;
  },
  
  canUpgrade: function(subscription) {
    
    subscription = this.findSubscription(subscription);
    
    if(!subscription || subscription.plan) {
      return false;
    }
    
    var plan = this.findPlan(subscription);
    
    if(!plan) {
      return false;
    }
    
    var query = {
      weight: { $gt: plan.weight }
    }
    
    if(Meteor.isServer) query.active = true;

    return Plans.find(query).count() > 0;
  }
  
});