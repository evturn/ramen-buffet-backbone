AppView = Backbone.View.extend({
	el: '#ramen-buffet',
  pendingTemplate: _.template($('#pending-template').html()),
  headerTemplate: _.template($('#header-template').html()),
  userToolsTemplate: _.template($('#user-tools-template').html()),
	events: {
    'keypress #new-todo'     : 'createOnEnter',
    'click #clear-completed' : 'clearPending',
    'click #toggle-all'      : 'toggleAllPending',
    'click #user-io'         : 'toggleAuth',
    'click #register-icon'   : 'renderRegister'
  },
	initialize: function() {
    this.readFirebaseTasks();
    this.readFirebaseUsers();
    this.renderUserTools();
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input      = this.$('#new-todo');
    this.$footer     = this.$('#footer');
    this.$header     = this.$('#header');
    this.$main       = this.$('#main');
    this.listenTo(workload, 'add', this.addOne);
    this.listenTo(workload, 'reset', this.addAll);
    this.listenTo(workload, 'change:pending', this.filterOne);
    this.listenTo(workload, 'filter', this.filterAll);
    this.listenTo(workload, 'all', this.render);
    this.listenTo(workload, 'all', this.resetHeader);
    workload.fetch();
  },
  render: function() {
    var pending = workload.pending().length;
    var remaining = workload.remaining().length;

    if (workload.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.pendingTemplate({
        pending: pending
      }));

      this.$header.html(this.headerTemplate({
        remaining: workload.length
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( TodoFilter || '' ) + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },
  readFirebaseTasks: function() {
    firebaseCollection.on("value", function(snapshot) {
        console.log('Firebase Collection', snapshot.val());
      }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
  },
  readFirebaseUsers: function() {
    firebaseUsers.onAuth(function(authData) {
      if (authData) {
        console.log("Authenticated with uid:", authData.uid);
        uid = authData.uid;
      } else {
        console.log("Client unauthenticated.");
      }
      this.renderUserTools();
    }.bind(this));
  },
  addOne: function(task) {
    var view = new TaskView({model: task});
    $('#todo-list').prepend(view.render().el);
  },
  addAll: function() {
    this.$('#todo-list').html('');
    workload.each(this.addOne, this);
  },
  filterOne : function(task) {
    task.trigger('visible');
  },
  filterAll : function() {
    workload.each(this.filterOne, this);
  },
	newAttributes: function() {
    var time = Firebase.ServerValue.TIMESTAMP
    return {
      title: this.$input.val().trim(),
      order: workload.nextOrder(),
      pending: false,
      timestamp: time,
      user_id: uid
    };
  },
  createOnEnter: function(e) {
    if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }
    workload.create( this.newAttributes() );
    this.$input.val('');
  },
  clearPending: function() {
    _.invoke(workload.pending(), 'destroy');
    return false;
  },
	toggleAllPending: function() {
    var pending = this.allCheckbox.checked;

    workload.each(function(task) {
      task.save({'pending': pending});
    });
  },
  resetHeader: function() {
    total = workload.length;
    if (total === 0) {
      this.$header.val('');
      this.$header.html(this.headerTemplate({
        remaining: workload.length
      }));
      $('#the-title').css({
        color: '#fff'
      });
    }
  },
  toggleAuth: function(e) {
    e.preventDefault();
    var authData = firebaseUsers.getAuth();
    if (!authData) {
      this.renderAuthForm();
    } else {
      this.logout();
    }
  },
  renderAuthForm: function() {
    var authForm = new AuthForm();
    authForm.renderLogin();
  },
  renderRegister: function(e) {
    e.preventDefault();
    var authForm = new AuthForm();
    authForm.renderRegister();
  },
  logout: function() {
    FIREBASE_URL.unauth();
    var refUsers      = new Firebase(FIREBASE_URL + 'users');
    var unauthConfirm = refUsers.getAuth();
  },
  renderUserTools: function() {
    $('#user-tools').html(this.userToolsTemplate());
    return this;
  }
});






