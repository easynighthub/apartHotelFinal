var ingresarAdmin = document.getElementById('signIn');

ingresarAdmin.addEventListener('click', function() {
    document.getElementById('BarraCargando').style.display = 'block';
    document.getElementById('signIn').style.display = 'none';

    var email = document.getElementById('correo').value;
    var password = document.getElementById('password').value;

     firebase.auth().signInWithEmailAndPassword(email, password).then(
      function(s){
         console.log(s);
    firebase.database().ref('/recepcionistas/' + s.uid).once('value').then(function(snapshot) {
   if (snapshot.val() != null)
    window.location.href = 'app';
    else {
   alert('');
   firebase.auth().signOut();
  }
  });
  },
   function(e) {
      console.log(e);
  alert('#');
  }
  );
});
