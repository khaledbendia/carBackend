var regexEmail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var regNumbers = /^\d+$/;
var globalURL="http://127.0.0.1:8000/";
var file;

var brand = ["Renault","Peugeot","Mercedes","BMW","Volkswagen","Kia"];
var model = [
["ARKANA","Captur","Clio","Espace","Express","Scenic","Twingo","Kangoo"],
["108","2008","208","3008","301","308","5008","508","605","Boxer","Expert","Partner","","Rifter","Traveller"],
["709","Atego","Citan","Classe A","Classe B","Classe C","Classe CLS","Classe E","Classe G","Classe GLK","Classe S"],
["I3","I3S","I4","I8","IX","IX3","Serie 1","Serie 2","Serie 3"],
["Amarok","Arteon","Caddy","California","Caravelle","Combi","Crafter","Golf","Polo","Tiguan","Touran","Touareg"],
["Picanto","Rio","Sorento","Ceed","Niro","Sportage"]
]

var filter = {
	"filterBrand" : "Tout",
	"filterModel":"Tout",
	
	"filterYearDe":"de",
	"filterYearA":"à",
	
	"filterPriceDe":"de",
	"filterPriceA":"à",

	"filterKiloDe":"de",
	"filterKiloA":"à",};

var resultItem =
	$("<div class='resultItem shadow bg-white rounded mb-3'>"+
		"<div  class='votreAnnonceContainer d-none position-relative'>"+
            "<div class ='position-absolute alert alert-primary m-0' style='right: 0' role='alert'>C'est votre annonce</div>"+
        "</div>"+
		"<div class='itemTitle d-flex'>"+
		"<h4 class='marque'>Audi</h4>&nbsp;&nbsp;<h4 class='modele text-muted'>A1</h4>"+
		"</div>"+
		"<div class='itemDetails d-flex mt-2'>"+
		"<div class='d-flex flex-wrap align-items-center  justify-content-center'>"+
		"<img class='imageUrl' src='' alt='image'>"+
		"</div>"+
		"<div class='p-2'>"+
		"<h4 class='prix'></h4>"+
		"<p class='kilo text-muted border-bottom'></p>"+
		"<p class='annee text-muted border-bottom'></p>"+
		"</div>"+
		"</div>"+
		"<button  type='button' class='showPhone btn btn-outline-primary mt-3' data-toggle='tooltip' data-placement='top' title='Tooltip on top'>Appeler</button>"+
		"<!-- Modal -->"+
		"<div class='modalPhone modal fade' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>"+
		"<div class='modal-dialog' role='document'>"+
		"<div class='modal-content'>"+
		"<div class='modal-header'>"+
		"<h5 class='modal-title' id='exampleModalLabel'>Télephone</h5>"+
		"</div>"+
		"<div class='phone modal-body'>"+
		""+
		"</div>"+
		"<div class='modal-footer'>"+
		"<button type='button' class='closeShowPhone btn btn-primary' data-dismiss='modal'>Fermer</button>"+
		"</div>"+
		"</div>"+
		"</div>"+
		"</div>"+
		"</div>");

	$(function(){
	//logo
	$("#logoImage").on("click",function(){
		window.location.reload();
	});
	//Filter AND AJouter
	for(var i=0;i<brand.length;i++)
	{
		$("#filterBrand,#marque").append(new Option(brand[i],brand[i]));
	}
	$( "#filterBrand" ).change(function() {
		var index = $(this).prop('selectedIndex')-1;
		$("#filterModel").html("");
		$("#filterModel").append(new Option("Tout","Tout"));
		if(index<0)
			return;
		
		for(var i=0;i<model[index].length;i++)
		{
			$("#filterModel").append(new Option(model[index][i],model[index][i]));
		}
	});
	$( "#marque" ).change(function() {
		var index = $(this).prop('selectedIndex')-1;
		$("#modele").html("");
		$("#modele").append(new Option("Tout","Tout"));
		if(index<0)
			return;
		
		for(var i=0;i<model[index].length;i++)
		{
			$("#modele").append(new Option(model[index][i],model[index][i]));
		}
	});
	for(var i=2021;i>=1900;i--)
	{
		
		$("#annee").append(new Option(i,i));
		$("#filterYearDe").append(new Option(i,i));
		$("#filterYearA").append(new Option(i,i));
	}
	for(var i=0;i<=10000000;i=i+100000)
	{
		$("#filterPriceDe").append(new Option(i+" DA",i));
		$("#filterPriceA").append(new Option(i+" DA",i));
	}
	for(var i=0;i<=1000000;i=i+100000)
	{
		$("#filterKiloDe").append(new Option(i+" KM",i));
		$("#filterKiloA").append(new Option(i+" KM",i));
	}
	//check connexion
	firebase.auth().onAuthStateChanged(function(user) {
		if(user)
		{
			$.ajax({
				url: globalURL+"getUser/",
				dataType: 'text',
				type: "POST",
				data: {uid : user.uid},
				success: function(data){
					var json = JSON.parse(data);
					$("#profileUID").html(json.uid);
					$("#profileUsername").html(json.username);
					$("#profileEmail").html(json.email);
					$("#profilePhone").html(json.phone);

					$("#header>div:eq(2)").addClass("d-none");
					$("#header>div:eq(1)").removeClass("d-none");

					getCars();
				},
				error:function(error)
				{
					firebase.auth().signOut().then(() => {
						alert("error");
						$("#header>div:eq(2)").addClass("d-none");
						$("#header>div:eq(0)").removeClass("d-none");
					}).catch((error) => {

					});

				}
			});
		}
		else
		{
			getCars();
			$("#header>div:eq(2)").addClass("d-none");
			$("#header>div:eq(0)").removeClass("d-none");
		}		
	});
	//question modal
	$("#question").on("click",function(){
		$("#modalQuestion").modal('show');
	});
	$("#closeQuestionModal").on("click",function(){
		$(this).parent().parent().parent().parent().modal('hide');
	});

	//phone modal=
	
	$('#result').delegate('.showPhone','click',function(){
		$(this).parent().find(".modalPhone").modal('show');
	});
	$('#result').delegate(".closeShowPhone","click",function(){
		$(this).parent().parent().parent().parent().modal('hide');
	});


	//connexion
	$("#connexion").on("click",function(){
		$("#modalConnexion").modal('show');
	});
	$("#signinContainerLink").on("click",function(){
		$("#signupContainer").css("visibility","visible");
		$("#signinContainer").css("visibility","hidden");

		$("#signupContainer").css("position","initial");
		$("#signinContainer").css("position","absolute");

	});
	$("#signupContainerLink").on("click",function(){
		$("#signupContainer").css("visibility","hidden");
		$("#signinContainer").css("visibility","visible");

		$("#signinContainer").css("position","initial");
		$("#signupContainer").css("position","absolute");
	});

	$("#signIn").on("click",function(){
		connect($("#signIn_email").val(),$("#signIn_password").val());
		//connect("aaaaa@gmail.com","071127223");
	});

	$("#signUp").on("click",function(){
		createUser($("#signUp_userName").val(),$("#signUp_email").val(),$("#signUp_phone").val(),$("#signUp_password").val(),$("#signUp_confirmPassword").val());
		//createUser("aaaaa","aaaaa@gmail.com","071127223","071127223","071127223");
	});

	$("#signIn_email,#signIn_password").on('focus', function () {
		$("#signIn_email").next('.invalid-feedback').removeClass("d-block");
		$("#signIn_email").removeClass("is-invalid");
		$("#signIn_password").next('.invalid-feedback').removeClass("d-block");
		$("#signIn_password").removeClass("is-invalid");
	});

	$("#signUp_email,#signUp_password,#signUp_userName,#signUp_confirmPassword").on('focus', function () {
		$("#signUp_email").next('.invalid-feedback').removeClass("d-block");
		$("#signUp_email").removeClass("is-invalid");
		$("#signUp_password").next('.invalid-feedback').removeClass("d-block");
		$("#signUp_password").removeClass("is-invalid");
		$("#signUp_confirmPassword").next('.invalid-feedback').removeClass("d-block");
		$("#signUp_confirmPassword").removeClass("is-invalid");
		$("#signUp_userName").next('.invalid-feedback').removeClass("d-block");
		$("#signUp_userName").removeClass("is-invalid");
	});
	$("#deconnexion").on("click",function(){
		firebase.auth().signOut().then(() => {
			window.location.reload();
		}).catch((error) => {

		});	
	});
	//ajouter
	$(".ajouterVoiture").on("click",function(){
		if(firebase.auth().currentUser)
			$("#modalAjouterVoiture").modal('show');
		else
			$("#modalConnexion").modal('show');
	});
	$("#ajouterImg").on("click",function(){
		$('#ajouterImgInput').trigger('click');

	});
	$("#ajouterImgInput").change(function(event){
		file = event.target.files[0];
		$("#ajouterImg").attr('src',URL.createObjectURL(file));
		
	});
	$("#addCar").on("click",function(event){
		addCar(
			firebase.auth().currentUser.uid,
			file,
			$("#marque").val(),
			$("#modele").val(),
			$("#annee").val(),
			$("#kilo").val(),
			$("#prix").val()
			);
	});
	$('#modalCarAjouter').on('hide.bs.modal', function (e) {
		window.location.reload();
	});
	//profile
	$("#profile").on("click",function(){
		$("#modalProfile").modal('show');
	});
	$("#closeProfileModal").on("click",function(){
		$(this).parent().parent().parent().parent().modal('hide');
	});
	

	//FILTER
	$( "#search select" ).on("change",function() {
		var index = $(this).prop('selectedIndex');
		
		var selectId=$(this).attr("id");
		var val = $(this).find(":selected").val();
		for (var key in filter) {
			if(key == selectId)
			{
				if(selectId == "filterBrand")
					filter["filterModel"] = "Tout";
				filter[key] = val ;
			}
		}
		getCarsFilter(filter);
	});

});

function getCarsFilter(filter)
{
	$("#spinnerResult").removeClass("d-none");
	$("#noCarsContainer").addClass("d-none");
	$("#noConnectionContainer").addClass("d-none");
	$("#result .resultItem").remove();
	$.ajax({
		url: globalURL+"getCarsFilter/",
		dataType: 'text',
		type: "POST",
		data: filter,
		success: function(data){
			$("#spinnerResult").addClass("d-none");

			var json = JSON.parse(data);
			console.log(json);
			if(json.length==0)
			{
				$("#spinnerResult").addClass("d-none");
				$("#noCarsContainer").removeClass("d-none");
				return;
			}
			for(var i = 0; i < json.length; i++) {
				oneCarShow(json[i].pk,json[i].fields);
			}

		},
		error:function(error)
		{
			$("#spinnerResult").addClass("d-none");
			$("#noConnectionContainer").removeClass("d-none");
			alert("error");	
		}
	});
}
function oneCarShow(pk,obj)
{
	firebase.storage().ref(obj.imageurl).getDownloadURL()
	.then((url) => {
		var item = $(resultItem).clone();
		try{
			if(obj.uid == firebase.auth().currentUser.uid)
				$(item).find(".votreAnnonceContainer").removeClass("d-none");
		}catch(e)
		{}
		
		$(item).attr("data",pk);
		$(item).attr("src",url);
		$(item).find(".imageUrl").attr("src",url);
		$(item).find(".marque").html(obj.brand);
		$(item).find(".modele").html(obj.model);
		$(item).find(".prix").html(obj.price+" DA");
		$(item).find(".kilo").html(obj.kilo+" KM");
		$(item).find(".annee").html(obj.year);
		$(item).find(".phone").html(obj.phone);

		//if($("#result .resultItem").length==0)
		$("#result").append(item);
		/*else
		{
			for(var i=0;i<$("#result .resultItem").length;i++)
			{
				//alert($("#result .resultItem").eq(i).attr("data"));
				
				if(parseInt($("#result .resultItem").eq(i).attr("data"))<parseInt($(item).attr("data")))
				{
					$("#result").append(item);
					//$(item).insertBefore($("#result .resultItem").eq(i));
					break;
				}
			}
		}*/


	})
	.catch((error) => {
		alert(error);
	});
}
function getCars()
{
	$.ajax({
		url: globalURL+"getCars/",
		dataType: 'text',
		type: "POST",
		data: {},
		success: function(data){
			$("#spinnerResult").addClass("d-none");
			var json = JSON.parse(data);
			if(json.length==0)
			{
				$("#spinnerResult").addClass("d-none");
				$("#noCarsContainer").removeClass("d-none");
				return;
			}
			for(var i = 0; i <json.length; i++) {
				oneCarShow(json[i].pk,json[i].fields);
			}

		},
		error:function(error)
		{
			$("#spinnerResult").addClass("d-none");
			$("#noConnectionContainer").removeClass("d-none");
			alert("error");	
		}
	});
}

function addCar(uid,fileImage,brand,model,year,kilo,price)
{
	if(fileImage==null)
	{
		$("#wrongImage").addClass("d-block");
		return;
	}
	if(brand=="Tout")
	{
		$("#marque").parent().find("div").addClass("d-block");
		return;
	}
	if(model=="Tout")
	{
		$("#modele").parent().find("div").addClass("d-block");
		return;
	}

	if(year=="Tout")
	{
		$("#annee").parent().find("div").addClass("d-block");
		return;
	}
	if(!regNumbers.test(kilo))
	{
		$("#kilo").parent().find("div").addClass("d-block");
		return;
	}
	if(!regNumbers.test(price))
	{
		$("#prix").parent().find("div").addClass("d-block");
		return;
	}

	$("#modalAjouterVoiture").modal('hide');
	$("#addCarProgress").removeClass("d-none");
	var imageId = uuidv4();
	var storageRef = firebase.storage().ref(imageId);
	var task = storageRef.put(fileImage);
	task.on('state_changed', function progress(snapshot) {
		var percentage = 5+((snapshot.bytesTransferred/snapshot.totalBytes)*100);
		$("#addCarProgress").width((percentage-15)+"%");
	}, function error(err) {
		$("#addCarProgress").addClass("d-none");
		alert("error");
	},function complete() {
		$.ajax({
			url: globalURL+"createCar/",
			dataType: 'text',
			type: "POST",
			data: {uid :uid,imageurl:imageId,brand:brand,model:model,year:year,kilo:kilo,price:price},
			success: function(data){
				$("#addCarProgress").width("100%");
				$("#addCarProgress").addClass("d-none");
				$("#modalCarAjouter").modal('show');

			},
			error:function(error)
			{
				alert("error");
				$("#addCarProgress").addClass("d-none");
			}
		});
	});
}
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function createUser(userName,email,phone,password,confirmPassword)
{
	var regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{5,}$/g
	if(!regex.test(userName))
	{
		$("#signUp_userName").next('.invalid-feedback').addClass("d-block");
		$("#signUp_userName").addClass("is-invalid");
		return;
	}
	if(!regexEmail.test(email))
	{
		$("#signUp_email").next('.invalid-feedback').addClass("d-block");
		$("#signUp_email").addClass("is-invalid");
		return;
		
	}
	if(!regNumbers.test(phone)&&phone.length!=10)
	{
		$("#signUp_phone").next('.invalid-feedback').addClass("d-block");
		$("#signUp_phone").addClass("is-invalid");
	}
	if(password.length<5)
	{
		$("#signUp_password").next('.invalid-feedback').addClass("d-block");
		$("#signUp_password").addClass("is-invalid");
		return;
		
	}
	if(password!=confirmPassword)
	{
		$("#signUp_confirmPassword").next('.invalid-feedback').addClass("d-block");
		$("#signUp_confirmPassword").addClass("is-invalid");
		return;
		
	}

	firebase.auth().createUserWithEmailAndPassword(email,password).then((userCredential) => {
		var user = userCredential.user;
		$.ajax({
			url: globalURL+"createUser/",
			dataType: 'text',
			type: "POST",
			data: {uid : user.uid,username:userName,email:email,phone:phone},
			success: function(html){
				//alert(html);
				window.location.reload();
			},
			error:function(error)
			{
				alert("error");
				$("#signUp_email").next('.invalid-feedback').addClass("d-block");
				$("#signUp_email").addClass("is-invalid");
			}
		});
	}).catch((error) => {
		alert(error);
		$("#signUp_email").next('.invalid-feedback').addClass("d-block");
		$("#signUp_email").addClass("is-invalid");
	});
}
function connect(email,password)
{
	
	if(!regexEmail.test(email))
	{
		$("#signIn_email").next('.invalid-feedback').addClass("d-block");
		$("#signIn_email").addClass("is-invalid");
		return;
		
	}
	if(password.length==0)
	{
		$("#signIn_password").next('.invalid-feedback').addClass("d-block");
		$("#signIn_password").addClass("is-invalid");
		return;
		
	}
	firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
		var user = userCredential.user;
		window.location.reload();
	})
	.catch((error) => {
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
		$("#signIn_email").next('.invalid-feedback').addClass("d-block");
		$("#signIn_email").addClass("is-invalid");
		$("#signIn_password").next('.invalid-feedback').addClass("d-block");
		$("#signIn_password").addClass("is-invalid");
	});
}