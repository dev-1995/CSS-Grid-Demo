			window.onload =getData();
			// ONload data Loader

				document.addEventListener('scroll',debounce(function(){
						if(getDistFromEnd() < 200)
						{
							updateView();
						}
					},200) );

				// Pagination
				function debounce(fn, delay){
					let inDebounce;
						  return function() {
						    const context = this;
						    const args = arguments;
						    clearTimeout(inDebounce);
						    inDebounce = setTimeout(function(){ fn.apply(context, args)}, delay);
						  }
					}

			function getData()
			{
				// I created this object to avoid polluting global namespace

				window.___data = { itemCount:0,productList:[],filterBy:'',arrToUse:'productList',filterArr:[] ,filterSelected:new Set()} ;
				var xhr = new XMLHttpRequest();
	 
	            xhr.onload = function () {

					if (xhr.status >= 200 && xhr.status < 300) {
						var response = JSON.parse(xhr.responseText).products;

						window.___data.productList = response;
						updateView();
					} else {
						// Runs when it's not
						console.log(xhr.responseText);

					}

				};
				xhr.open('GET', 'https://test-prod-api.herokuapp.com/products');
				xhr.send();
			}


			function updateView(filter=false)
			{
				var data = ___data;
				var from=data.itemCount;
				var arr = data[data.arrToUse];
				var items='';

				for(let i=from;i<from+9;i+=3)
				{

					items+='<div class="product"><div class="img"><img  src="'+arr[i].img.replace("http","https")+'" alt="">										</div><div class="nested"> <div class="titles">'+arr[i].name.toUpperCase()+'</div><div class="titles">INR '+arr[i].price+'</div>											 <div class="titles">'+arr[i].score.toFixed(3)+'</div> <div class="titles">'+arr[i].cat.toUpperCase()+'</div></div></div>';

					items+='<div class="product">	<div class="img"><img  src="'+arr[i+1].img.replace("http","https")+'" alt="">										</div><div class="nested"> <div class="titles">'+arr[i+1].name.toUpperCase()+'</div><div class="titles">INR '+arr[i+1].price+'</div>											 <div class="titles">'+arr[i+1].score.toFixed(3)+'</div> <div class="titles">'+arr[i+1].cat.toUpperCase()+'</div></div></div>';

					items+='<div class="product">	<div class="img"><img  src="'+arr[i+2].img.replace("http","https")+'" alt="">										</div><div class="nested"> <div class="titles">'+arr[i+2].name.toUpperCase()+'</div><div class="titles">INR '+arr[i+2].price+'</div>											 <div class="titles">'+arr[i+2].score.toFixed(3)+'</div> <div class="titles">'+arr[i+2].cat.toUpperCase()+'</div></div></div>';
					
				}

				data.itemCount+=9;
				var element= document.getElementById('itemList');
				filter ? element.innerHTML = "" : null ;	
				element.innerHTML=element.innerHTML+items;
				
			}


			function getDistFromEnd () {

		  var scrollPosition = window.pageYOffset;
		  var windowSize     = window.innerHeight;
		  var bodyHeight     = document.body.offsetHeight;

		  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);

		}


				function applyFilter(el)
				{
					var data = ___data;
					
					if(data.filterSelected.has(el.text.toLowerCase()) && [...data.filterSelected.keys()].length==1)
					{
						
						el.className="filterItem";
						data.arrToUse='productList';
						data.filterSelected.delete(el.text.toLowerCase());
						data.filterArr = [];
						data.itemCount=0;
						updateView(true);
						resetSort();
					}
					else if(el == document.getElementsByClassName('active')[0])
					{

						
						el.className="filterItem";
						data.arrToUse='filterArr';
						data.filterSelected.delete(el.text.toLowerCase());
						data.filterArr = returnFilteredArray();
						shuffleArray(data.filterArr);
						data.itemCount=0;
						updateView(true);
						resetSort();

						
					}
					else  
					{
						var itemArray = document.getElementsByClassName('filterItem');
						data.filterSelected.add(el.text.toLowerCase());
						// for(var item of [...data.filterSelected.keys()]){ console.log(contains('a', /item$/i)) }
						el.className="filterItem active";
						data.filterArr = returnFilteredArray();
						data.arrToUse='filterArr';
						data.itemCount=0;
						updateView(true);
						resetSort();
					}
				
				}
				function contains(selector, text) {
				  var elements = document.querySelectorAll(selector);
				  return Array.prototype.filter.call(elements, function(element){
				    return RegExp(text).test(element.textContent);
				  });
				}

				function returnFilteredArray()
				{
					var filters = [...___data.filterSelected];
					var tempArr = [];
					for(let i = 0; i < filters.length;i++)
					{
						tempArr.push(...___data.productList.filter(item => item.cat == filters[i]));
					
					}
				
					return tempArr;

				}
				function shuffleArray(array) {
					    for (var i = array.length - 1; i > 0; i--) {
					        var j = Math.floor(Math.random() * (i + 1));
					        var temp = array[i];
					        array[i] = array[j];
					        array[j] = temp;
					    }

					}

				function sortItems(val)
				{
					var data = ___data;
					data[data.arrToUse]= data[data.arrToUse].sort(dynamicSort(val));
					updateView(true);
				}

				function resetSort()
				{
					document.querySelector('.sort [value=""]').selected = true;
				}

				function dynamicSort(property) {
				    var sortOrder = 1;
				    if(property[0] === "-") {
				        sortOrder = -1;
				        property = property.substr(1);
				    }
				    return function (a,b) {
				        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
				        return result * sortOrder;
				    }
				}
