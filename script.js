var request = new XMLHttpRequest();
var popularity_list = [];
var titles = ["Movies Title", "Genre", "Popularity", "Release Date"];
var pop_filter_submit_list = [];
request.open(
  "GET",
  "https://api.themoviedb.org/3/discover/movie?api_key=a07eb55022388f23593b113171ea9703&page=4",
  true
);

var tableForMovie =
  '<table class ="tableStyling" cellpadding="0" cellspacing="0" border = 1 align = "center"><tbody><tr>';
request.onload = function() {
  var data = JSON.parse(this.response);
  //console.log(data);

  //var lengthOfResults = data.results.length;

  if (request.status >= 200 && request.status < 400) {
    for (var i = 0; i < 4; i++)
      tableForMovie +=
        "<th>" +
        titles[i] +
        "<input type='image' id='" +
        titles[i] +
        "' src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-512.png' class='hidden'></th>";
    //tableForMovie += "<th><div " + titles[i] + "<a><img id='pic" + i + "'src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-512.png' class='hidden'></img></a></th>";
    data.results.forEach(movie => {
      //console.log(movie.title);
      tableForMovie += "</tr><tr>";
      tableForMovie += "<td>" + movie.title + "</td>";
      tableForMovie += "<td>" + movie.genre_ids + "</td>";
      tableForMovie += "<td>" + movie.popularity + "</td>";
      tableForMovie += "<td>" + movie.release_date + "</td>";
      tableForMovie += "</tr><tr>";
      popularity_list.push(Math.ceil(movie.popularity));
      popularity_list = Array.from(new Set(popularity_list));
    });
  } else {
    console.log("error");
  }

  document.getElementById("movieTable").innerHTML = tableForMovie;
  console.log(document.getElementById("movieTable"));
  getModal();
};
request.send();

function filter() {
  for (var i = 0; i < 4; i++) {
    var img = document.getElementById(titles[i]);
    img.classList.toggle("hidden");
  }
  var filter_btn = document.getElementById("filter_btn");
  if (filter_btn.style.background == "white") {
    filter_btn.style.background = "blue";
  } else {
    filter_btn.style.background = "white";
  }
}

function getModal() {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // Get the button that opens the modal
  var dropDownButton = document.getElementById("Popularity");

  dropDownButton.onclick = function() {
    modal.style.display = "block";
  };
  var modal_content = "<form id='pop_form'><p><label>Choose option</label></p>";
  for (var i = 0; i < popularity_list.length; i++) {
    modal_content +=
      "<p><label><input type='checkbox' id='option" +
      i +
      "' class='filled-in' value='" +
      popularity_list[i] +
      "'/><span>" +
      popularity_list[i] +
      "</span></label></p>";
  }
  modal_content +=
    "</form><button onclick='get_pop_filter_add_list()' id='pop_filter'>Apply</button>";

  document.getElementsByClassName("modal-header")[0].innerHTML += modal_content;
  console.log(document.getElementsByClassName("modal-header")[0]);

  //When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function get_pop_filter_add_list() {
  var popularity_form = document.getElementById("pop_form");
  console.log(popularity_form);
  var checked_element = document.getElementsByClassName("filled-in");
  for (var i = 0; checked_element[i]; ++i) {
    if (checked_element[i].checked) {
      console.log(checked_element[i].value);
      pop_filter_submit_list.push(checked_element[i].value);
    }
  }
  update_table(pop_filter_submit_list);
  document.getElementById("myModal").style.display = "none";
}

function update_table(pop_filter_submit_list) {
  request.open(
    "GET",
    "https://api.themoviedb.org/3/discover/movie?api_key=a07eb55022388f23593b113171ea9703&page=4",
    true
  );
  console.log("list_pop" + pop_filter_submit_list);
  request.onload = function() {
    var data = JSON.parse(this.response);
    //console.log("list_pop" + pop_filter_submit_list);
    //console.log("data" + data);
    var lengthOfResults = data.results.length;
    var updated_table =
      '<table class ="tableStyling" cellpadding="0" cellspacing="0" border = 1 align = "center"><tbody><tr>';
    if (request.status >= 200 && request.status < 400) {
      for (var i = 0; i < 4; i++)
        updated_table +=
          "<th>" +
          titles[i] +
          "<input type='image' id='" +
          titles[i] +
          "' src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-512.png' class='hidden'></th>";
      for (var i = 0; i < lengthOfResults; ++i) {
        for (var j = 0; j < pop_filter_submit_list.length; j++) {
          if (
            Math.ceil(data.results[i].popularity) == pop_filter_submit_list[j]
          ) {
            //console.log("Matched : " + data.results[i].popularity);
            updated_table += "</tr><tr>";
            updated_table += "<td>" + data.results[i].title + "</td>";
            updated_table += "<td>" + data.results[i].genre_ids + "</td>";
            updated_table += "<td>" + data.results[i].popularity + "</td>";
            updated_table += "<td>" + data.results[i].release_date + "</td>";
          }
        }
      }
    }
    document.getElementById("movieTable").innerHTML = updated_table;
  };
  request.send();
}