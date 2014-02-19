$(document).ready(function(){
	$('.form-signin').validate({
		rules:{
			idInstitutes:{
				required: true,
				maxlength: 5,
			},
			I_email:{
				email: true
			},
			I_name:{
				required: true
			},
			idUser:{
				required: true
			},
			U_email:{
				required:true,
				email:true
			},
			U_password:{
				required: true,
				minlength: 5
			},
			Confirmation: {
				required: true,
				minlength: 5,
				equalTo: "#U_password"
			},
			C_description:{
				maxlength: 500
			}
		},
		success: function(element){
			element.text('Valid').addClass('valid')
		}
	});
});