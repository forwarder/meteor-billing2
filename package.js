Package.describe({
  summary: "Subscription and feature management for Meteor."
});

Package.on_use(function (api) {
  
  api.use(['underscore', 'handlebars'], ['client', 'server']);
  
  api.add_files('billing_common.js', ['client', 'server']);
  api.add_files('billing_server.js', 'server');
  api.add_files('billing_client.js', 'client');

  if(api.export) {
    api.export('Billing');
  }
});
