Billing.upgradeTo = function(subscription, plan) {

  if (!subscription) {
    throw new Meteor.Error(400, "Invalid subscription");
  }
  
  var subscription = this.findSubscription(subscription);
  
  if (!subscription) {
    throw new Meteor.Error(404, "Invalid subscription");
  }
  
  var currentPlan = this.findPlan(subscription.plan);
  
  var plan = this.findPlan(plan);
  
  if (currentPlan && currentPlan.weight > plan.weight) {
    throw new Meteor.Error(400, "Can't upgrade to this subscription");
  }
  
  if (Billing.onBeforeUpgrade && !Billing.onBeforeUpgrade(subscription, plan)) {
    return false;
  }

  Subscription.update({
    _id: subscription._id
  }, {
    $set: {
      'plan': plan._id
    }
  }, {validate: false});
  
  Billing.onAfterUpgrade && Billing.onAfterUpgrade(subscription, plan);
  
  return true;
}

Meteor.methods({
  'billingUpgradeTo': function(plan) {
    var subscriber = Billing.subscriber();
    
    if(!subscriber) {
      throw new Meteor.Error(403, "You need to be logged in to upgrade your account");
    }
    
    return Billing.upgradeTo(subscriber.subscription, plan);
  }
});