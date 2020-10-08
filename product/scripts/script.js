$( document ).ready(function(){

	delete_product()
	get_result_price();



	/*Табы*/
	let current_tabs;
	$( "ul.head_tabs > li" ).click(function(){ 
			
		$('ul.head_tabs > li').removeClass('active');
		$(this).addClass("active");

		current_tabs = $(this).attr("data-open-tabs");

		$('.data_tabs > div').removeClass('active');
		$('.data_tabs > div#'+current_tabs).addClass('active');
	});

	$(".btn").click(function() {
		event.preventDefault();

		var znachennie_poiska;

		znachennie_poiska = $("[name='Search']").val();

		if (znachennie_poiska == "") {

			znachennie_poiska = "Введите название продукта!";

		}

		alert(znachennie_poiska);
	});



    //итоговая цена
	function get_result_price(){
	
		var resultat = 0;
		var cout_pro = 0;

		$(".listing_zakazov .dannye_tovarov sup span:nth-child(2)").each(function( index ) {
			resultat = resultat + parseFloat($(this).text());
		});

		$(".listing_zakazov .dannye_tovarov .cart_count span:nth-child(2)").each(function( index ) {
			cout_pro = cout_pro + parseFloat($(this).text());
		});

		if (resultat == 0) {
			$( ".listing_zakazov" ).html("<span class='cart_ttl'>Простите, Ваша корзина пуста!</span>");
			$('span.summa_v_korzine').html("₽ 0");
			$('span.kol_tovarov').html("0");
			$('.itog').html("0");

		} else {
			$( ".cart_ttl" ).remove();
			$('.itog').html(" ₽"+resultat);
			$('span.summa_v_korzine').html("/"+resultat+ " ₽");
			$('span.kol_tovarov').html(cout_pro);
		}

	}
		
	//Выбрать Цвет и Размер
	$( "ul.list_color > li" ).click(function(){ 		
		$(this).parent(".list_color").children('li').removeClass('active');
		$(this).addClass("active");
	});	

	$( "ul.list_size > li" ).click(function(){ 		
		$(this).parent(".list_size").children('li').removeClass('active');
		$(this).addClass("active");
		delete_product()
	});	
	

	//Кнопки плюс и минус
	$( ".count_product button" ).click(function(){ 

		let curren_btn, current_count, new_count;
		
		curren_btn = $(this).attr('data-type');
		current_count = $(".count_product .js-number").val();
		
		if (current_count >0 ) {
			if(curren_btn == "plus"){
				new_count = +current_count+1;
			} else {
				new_count = +current_count-1;
			}
		} else {
			$(".count_product .js-number").val(0);
		}
		
		$(".count_product .js-number").val(new_count);

	});

	$( ".jq_click > div" ).on("click" , function(event) {
		event.preventDefault();

		$(this).children(".jq_open").slideToggle(300);

	}); 


	//Добавление товара в корзину
	$( "a.add_to_cart" ).click(function(){ 
		event.preventDefault();

		var check_product_color, check_product_size;


		if ( $(".product_color .list_color > li").hasClass("active") ) {

			$(".product_color .list_color").css({'border' : '1px solid transparent'});
			check_product_color = 1;
		 
		} else {
			$(".product_color .list_color").css({'border' : '1px solid transparent'});
			alert("Выберите цвет товара!");
		}

		if ( $(".product_size .list_size > li").hasClass("active") ) {

			$(".product_size .list_size").css({'border' : '1px solid transparent'});
			check_product_size = 1;
		 
		} else {
			$(".product_size .list_size").css({'border' : '1px solid transparent'});
			alert("Выберите размер товара!");
		}



		if (check_product_color == 1 && check_product_size == 1) {
			var name, cena, cvet, razmer, img_src, add_content, result_price, body_cart;

			$(".cart_ttl").css({"display": "none"});

			name 		= $("h3.title.def_color_txt").text();
			kolichestvo = $(".count_product .js-number").val();
			cvet 		= $(".product_color ul.list_color li.active span > span").text();
			razmer 		= $(".product_size ul.list_size li.active span > span").text();;
			cena 		= $(".product_info .price .cena_za_odin").text();
			img_src 	= $("ul#lightgallery > li:first-child > img").attr("src");
			result_price = cena * kolichestvo;

			add_content  ='<div class="dannye_tovarov"><a href=""><div class="kartinka_tovara"><img src="http://wp1.moydunovdastan.ndzjp.spectrum.myjino.ru/product/'+img_src+'" alt=""></div><div class="opisanie_tovara"><p>'+name+'</p><p class="cart_count"><span>Количество:</span><span>  '+kolichestvo+'</span></p><p class="cart_color_size"><span>'+cvet+'  </span><span>'+razmer+'</span></p><div class="block_price"><span class="originalnaya_cena"><span class="symbol">$</span><span class="cena_za_odin">  '+cena+'</span></span><sup> <span>*</span><span>'+result_price+'</span></sup></div></div></a><div class="udalit_zakaz"><i class="fa fa-trash" aria-hidden="true"></i></div></div>';
			
			$(add_content).appendTo(".listing_zakazov");
			body_cart= $(".block_opisanie_korziny").html();

			$.ajax({	
				type: "POST",
				url: 'http://wp1.moydunovdastan.ndzjp.spectrum.myjino.ru/product/cart.php',
				data: { content: body_cart}
			
			}).done(function( msg ) {
				alert("Ваш товар добавлен!");
			});
			
			delete_product();
			get_result_price();

			$(".list_size .list_color > li").removeClass('active');
			$(".js-number").val(1);
		}
	});


	// Удаление товара в корзине
	function delete_product(){
		$( ".dannye_tovarov" ).on("click", ".udalit_zakaz", function(event) {
			$(this).parent(".dannye_tovarov").remove();

			body_cart 		= $(".block_opisanie_korziny").html();

			$.ajax({
			
				type: "POST",
				url: 'http://wp1.moydunovdastan.ndzjp.spectrum.myjino.ru/product/cart.php',
				data: { content: body_cart}
			
			});
			
			get_result_price()
		});	
	}

	// Аjax
	function get_product_list(){
		$.ajax({
			method: "POST",
			url: 'http://wp1.moydunovdastan.ndzjp.spectrum.myjino.ru/product/cart.php',
			dataType: 'text',

			success: function (data) {
				if (data != "") {
					$(".block_opisanie_korziny").html(data);
				}


				get_result_price();
				delete_product();
			}
		});

	}

});