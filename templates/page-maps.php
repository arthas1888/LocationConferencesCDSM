<?php
/**
 * Template Name: Salas de conferencia
 */

get_header();

get_template_part( 'partials/title_box' );

?>
 <link rel="stylesheet" href="/wp-content/uploads/2016/12/angular-class.min_.css">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" href="/wp-content/uploads/2016/12/main.css">


    <div ng-app="angularApp" ng-controller="LocationController" layout="column" ng-cloak style="height: 600px">
    <section layout="row" flex style="height: 100%; position: relative;">
      <md-button class="md-fab md-primary md-hue-2 md-mini" aria-label="mi ubicacion" ng-click="myLocation()">
        <md-icon md-font-set="material-icons">location_searching</md-icon>
      </md-button>

      <md-content flex layout style="height: 600px">
        <input id="pac-input" class="controls" type="text" placeholder="Ingrese una ubicación">
        <div my-map="" flex-gt-sm flex></div>
      </md-content>

      <md-button class="md-raised md-primary md-hue-2" ng-click="openSide()" ng-if="$mdMedia('max-width: 960px')">
        <md-icon class="material-icons">view_headline</md-icon>
      </md-button>



      <md-sidenav class="md-sidenav-right md-whiteframe-4dp sidebar-right" ng-class="{active: btnClassActive && $mdMedia('gt-sm')}"
       md-is-locked-open="$mdMedia('gt-sm')" md-component-id='right'>

        <md-toolbar layout="row" class="md-hue-2 md-whiteframe-4dp" ng-show="!showSearch">
          <div class="md-toolbar-tools">
            <md-button class="md-icon-button" ng-click="toggleSideNav()" ng-if="$mdMedia('gt-sm')" aria-label="Back">
              <md-icon class="material-icons">view_headline</md-icon>
            </md-button>
            <md-button class="md-icon-button" ng-click="closeSide()" ng-if="$mdMedia('max-width: 960px')" aria-label="Back">
              <md-icon class="material-icons">view_headline</md-icon>
            </md-button>
            <span ng-hide="btnClassActive && $mdMedia('gt-sm')">Salas Cercanas</span>
            <span flex ng-hide="btnClassActive && $mdMedia('gt-sm')"></span>
            <md-button aria-label="Search" class="md-icon-button" ng-hide="btnClassActive && $mdMedia('gt-sm')" ng-click="showSearch = !showSearch">
              <md-icon class="material-icons">search</md-icon>
            </md-button>
          </div>
        </md-toolbar>
        <md-toolbar class="md-hue-3 md-whiteframe-1dp" ng-show="showSearch" style="background-color: #fff;">
          <div class="md-toolbar-tools" style="font-size:18px !important;">
            <md-button class="md-icon-button" ng-click="backButton()" aria-label="Back">
              <md-icon class="material-icons">navigate_before</md-icon>
            </md-button>
            Atras
            <div>
              <md-input-container class="md-block" style="top: 14px; left: 10px;" flex-gt-sm>
                <label>Buscar</label>
                <input ng-model="search">
              </md-input-container>
            </div>
            <span flex></span>
            <md-button aria-label="Search" class="md-icon-button">
              <md-icon class="material-icons">search</md-icon>
            </md-button>
          </div>

        </md-toolbar>


        <md-content style="height: calc(100% - 64px);" ng-hide="btnClassActive">
          <md-list flex>
            <md-subheader class="md-no-sticky" style="background-color: #fff;">Mostrando {{(model | filter:search:strict).length}} salas
            </md-subheader>
            <md-list-item class="md-3-line" ng-repeat="item in model | filter:search:strict" ng-click="location(item)">
              <md-icon class="md-avatar material-icons">place</md-icon>
              <div class="md-list-item-text" layout="column">
                <h3>Sala <strong>{{ item.nombre }}</strong></h3>
                <h4>Distancia {{ item.distance_m | number:1 }} mts</h4>
                <p>{{ item.direccion }} {{ item.ciudad }}, {{ item.pais }}</p>
              </div>
              <md-divider></md-divider>
            </md-list-item>
            <md-divider></md-divider>
          </md-list>
        </md-content>

      </md-sidenav>


    </section>
  </div>
  <md-divider></md-divider>
  <script src="/wp-content/uploads/2016/12/markerclusterer.js"></script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDLHLp0zlKdguRU-dpSNTYz0xuJ2DBKna8&libraries=places"></script>
  <script src="/wp-content/uploads/2016/12/angular-class.min_.js"></script>
  <script src="/wp-content/uploads/2016/12/location.js"></script>

  <br><br>
  <div class="content-area">

		<?php
			while ( have_posts() ) {
				the_post();

				get_template_part( 'partials/content', 'page' );

			}
		?>

	</div>


<?php get_footer(); ?>