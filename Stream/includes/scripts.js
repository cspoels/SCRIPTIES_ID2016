jQuery(document).ready(function($) {
	$("div")
	// Blast the text apart by word.
	.blast({ delimiter: "character" })
	// Fade the words into view using Velocity.js.
	.velocity("transition.fadeIn", { 
		display: "inline-block",
		duration: 10,
		stagger: 10,
		delay: 400
	});
	$("#nav").on('click', '.thesis_option', function(event) {
		event.preventDefault();
		var the_thesis = $(this).attr('id');

		

		
		$.ajax({
			url: 'includes/get_thesis.php',
			type: 'POST',
			dataType: 'text',
			data: {filename:the_thesis},
			complete: function(text){
				
				// $("#cas_spoelstra_content").html(text.responseText);
				$('.newest_thesis').addClass('old_thesis').removeClass('newest_thesis');
				jQuery('<div/>', {
				    class: 'newest_thesis'
				}).appendTo('body');

				$(".newest_thesis").html(text.responseText);

				$(".newest_thesis")
				// Blast the text apart by word.
				.blast({ delimiter: "character", aria:false, returnGenerated:true })
				// Fade the words into view using Velocity.js.
				.velocity("transition.fadeIn", { 
					display: "inline-block",
					duration: 200,
					stagger: 200,
					delay: 400
				}, {
					progress:function(elements, complete, remaining, start, tweenValue){console.log(elements);}
				});
				$(".old_thesis").velocity("stop");
					$(".old_thesis").children().children('.blast').each(function(index, el) {
						$(this).velocity("stop");
					});

				
			}
		})
		.done(function() {
			console.log();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		


	});
});

$(document).on('click', 'body', function(event) {
	event.preventDefault();
	
});


