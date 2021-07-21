var sigepUrl = 'https://konga.mmaya.gob.bo:8443/dev/sigep/v1'
var url = 'https://konga.mmaya.gob.bo:8443/dev/sisin/v1'

var api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlzcyI6Iml1ZjlYZURibjloamRWUHlYVmtIQXBhYUJLbGpnSHIwIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.0tP83tai3YKEocYHowjY5tGl_K60waaNt9YAmZNowxI';
var tabla;

var datos1 = []

function getHeader() {
    return {
        headers: { 
            Accept :"application/json",
            Authorization :"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlzcyI6Iml1ZjlYZURibjloamRWUHlYVmtIQXBhYUJLbGpnSHIwIn0.eyJuYW1lIjoiSm9obiBEb2UiLCJudW1iZXIiOjE1MTYyMzkwMjJ9.2C8IMN0WRn9pDF_yCKx2Zx6zr4hern7Gwxy0pyrtGF0",
        }
    };
}

var vm = new Vue({
    el:'#my-app',
    vuetify: new Vuetify(),
    delimiters: ['%%', '%%'],
    data: () => {
        return {
            page: 'SIGEP',
            title: 'Proyectos SIGEP',
            dependencia: [],
						dependencias: [],
						montos: '',
						general: [],
						capital: [],
						tcapital: [],
						corriente: [],
						tcorriente: [],
						searchGeneral: '',
						headersGeneral: [
							{ text: '#', value: 'itemId' },
							{ text: 'Dependencia', value: 'nombre' },
							{ text: 'Inicial', value: 'inicial' },
							{ text: 'Vigente', value: 'vigente' },
							{ text: 'Devengado', value: 'devengado' },
							{ text: 'Saldo', value: 'saldo' },
							{ text: '%Ejec', value: 'ejec' },
						],
						searchCapital: '',
						searchCorriente: '',
            cont: 0,
            headers: [],
            projects: [],
            loading: false,
            departamentos: [],
            provincias: [],
            municipios: [],
            departamento: '',
            provincia: '',
            municipio: '',
            search: '',
            project: {}
        }
    },
    async mounted(){
			await this.getDependencias()
			await this.getSigepMontos()

      await this.getDepartamentos()
      await this.getProjects()
      await this.getHeaders()
    },
    watch: {
      departamento: function() {
        this.getProvincias()
      },
      provincia: function() {
        this.getMunicipios()
      },
      municipio: function() {
        this.getProjects()
      },
    },
    methods: {
			changePage(newPage) {
				this.page = newPage
			},
			// SIGEP
			async getDependencias() {
				let response = await axios.get(`${sigepUrl}/dependencias`)
        if(response.status === 200) {
          this.dependencias = response.data.dependencia
        }
			},
			async getSigepMontos() {
				let response = await axios.get(`${sigepUrl}/montos`)
        if(response.status === 200) {
          this.montos = response.data
					this.general = response.data.general
					this.capital = response.data.capital
					this.corriente = response.data.corriente

					this.chartGeneral1('chartdivgeneral1', this.general)
					this.chartGeneral1('chartdivcapital1', this.capital)
					this.chartGeneral1('chartdivcorriente1', this.corriente)
        }
			},

			chartGeneral1(div, datos) {
				am4core.addLicense("ch-custom-attribution");
				am4core.ready(function() {

					// Themes begin
					am4core.useTheme(am4themes_animated);
					// Themes end
					
					// Create chart instance
					var chart = am4core.create(div, am4charts.XYChart3D);
					chart.responsive.enabled = true;

					chart.data = datos
					
					// Create axes
					var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
					categoryAxis.dataFields.category = "nombre";
					categoryAxis.renderer.grid.template.location = 0;
					categoryAxis.renderer.minGridDistance = 30;
					categoryAxis.renderer.labels.template.rotation = 270;
					categoryAxis.renderer.labels.template.hideOversized = false;
          categoryAxis.renderer.labels.template.truncate = true;
					categoryAxis.renderer.labels.template.maxWidth = 100;
					
					var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
					valueAxis.title.text = "Monto en Bs.";
					valueAxis.renderer.labels.template.adapter.add("text", function(text) {
						return text ;
					});
					
					// Create series
					var series = chart.series.push(new am4charts.ColumnSeries3D());
					series.dataFields.valueY = "devengado";
					series.dataFields.categoryX = "nombre";
					series.name = "Monto devengado";
					series.clustered = false;
					series.columns.template.tooltipText = "Devengado: [bold]{valueY}[/]";
					series.columns.template.fillOpacity = 0.9;
					
					var series2 = chart.series.push(new am4charts.ColumnSeries3D());
					series2.dataFields.valueY = "vigente";
					series2.dataFields.categoryX = "nombre";
					series2.name = "Monto vigente";
					series2.clustered = false;
					series2.columns.template.tooltipText = "Vigente: [bold]{valueY}[/]";
					
				}); // end am4core.ready()
			},


			// SISIN
      async getHeaders() {
        let response = await axios.get(`${url}/catalogos`)
        if(response.status === 200) {
          response.data.map((item, index) => {
            // Definimos que columnas se mostraran en la tabla
            if(['f1','f2','f3','f4','f9','f10'].includes(item.cod)){
              this.headers.push({
                text: item.nombre,
                value: item.cod
              })
            }
          })
        }
      },
      async getProjects() {
        this.loading = true
        var params = [];
        if(this.departamento !== '') {
          params.push('depid='+this.departamento)
        }
        if(this.provincia !== '') {
          params.push('provid='+this.provincia)
        }
        if(this.municipio !== '') {
          params.push('munid='+this.municipio)
        }

        console.log(params)

        var paramurl = ''
        params.map((param, index) => {
          console.log(index)
          paramurl = paramurl + (index == 0?`?${param}`:`&${param}`)
        })
        //console.log('url',`${url}/proyectos${paramurl}`)
        this.projects = []
        let response = await axios.get(`${url}/proyectos${paramurl}`)
        if(response.status === 200) {
          this.projects = response.data.datos
          
          am4core.addLicense("ch-custom-attribution");
          
          am4core.ready(function() {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv", am4charts.XYChart);
            chart.scrollbarX = new am4core.Scrollbar();

            // Add data
            chart.data = response.data.entidad;

            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "entidad";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.verticalCenter = "middle";
            categoryAxis.renderer.labels.template.rotation = 270;
            categoryAxis.tooltip.disabled = true;
            categoryAxis.renderer.minHeight = 110;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.minWidth = 50;

            // Create series
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.sequencedInterpolation = true;
            series.dataFields.valueY = "cant";
            series.dataFields.categoryX = "entidad";
            series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
            series.columns.template.strokeWidth = 0;

            series.tooltip.pointerOrientation = "vertical";

            series.columns.template.column.cornerRadiusTopLeft = 10;
            series.columns.template.column.cornerRadiusTopRight = 10;
            series.columns.template.column.fillOpacity = 0.8;

            // on hover, make corner radiuses bigger
            var hoverState = series.columns.template.column.states.create("hover");
            hoverState.properties.cornerRadiusTopLeft = 0;
            hoverState.properties.cornerRadiusTopRight = 0;
            hoverState.properties.fillOpacity = 1;

            series.columns.template.adapter.add("fill", function(fill, target) {
              return chart.colors.getIndex(target.dataItem.index);
            });

            // Cursor
            chart.cursor = new am4charts.XYCursor();

          }); // end am4core.ready()



          am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv1", am4charts.XYChart3D);

            // Add data
            chart.data = response.data.programa;
            

            // Create axes
            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "programa";
            categoryAxis.renderer.labels.template.rotation = 270;
            categoryAxis.renderer.labels.template.hideOversized = false;
            categoryAxis.renderer.labels.template.truncate = true;
            categoryAxis.renderer.labels.template.maxWidth = 120;
            //categoryAxis.renderer.labels.template.wrap = true;
            categoryAxis.renderer.minGridDistance = 20;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.verticalCenter = "middle";
            categoryAxis.tooltip.label.rotation = 270;
            categoryAxis.tooltip.label.horizontalCenter = "right";
            categoryAxis.tooltip.label.verticalCenter = "middle";

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "Cantidad";
            valueAxis.title.fontWeight = "bold";

            // Create series
            var series = chart.series.push(new am4charts.ColumnSeries3D());
            series.dataFields.valueY = "cant";
            series.dataFields.categoryX = "programa";
            series.name = "Visits";
            series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
            series.columns.template.fillOpacity = .8;

            var columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;
            columnTemplate.stroke = am4core.color("#FFFFFF");

            columnTemplate.adapter.add("fill", function(fill, target) {
              return chart.colors.getIndex(target.dataItem.index);
            })

            columnTemplate.adapter.add("stroke", function(stroke, target) {
              return chart.colors.getIndex(target.dataItem.index);
            })

            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineX.strokeOpacity = 0;
            chart.cursor.lineY.strokeOpacity = 0;

          }); // end am4core.ready()
          


          am4core.ready(function() {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            var chart = am4core.create("chartdiv2", am4charts.XYChart);

            chart.data = response.data.sector;

            chart.padding(40, 40, 40, 40);

            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "sector";
            categoryAxis.renderer.labels.template.rotation = 270;
            categoryAxis.renderer.labels.template.hideOversized = false;
            categoryAxis.renderer.labels.template.truncate = true;
            categoryAxis.renderer.labels.template.maxWidth = 120;
            //categoryAxis.renderer.labels.template.wrap = true;
            categoryAxis.renderer.minGridDistance = 20;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.verticalCenter = "middle";
            categoryAxis.tooltip.label.rotation = 270;
            categoryAxis.tooltip.label.horizontalCenter = "right";
            categoryAxis.tooltip.label.verticalCenter = "middle";

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.extraMax = 0.1;
            //valueAxis.rangeChangeEasing = am4core.ease.linear;
            //valueAxis.rangeChangeDuration = 1500;

            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "sector";
            series.dataFields.valueY = "cant";
            series.tooltipText = "{valueY.value}"
            series.columns.template.strokeOpacity = 0;
            series.columns.template.column.cornerRadiusTopRight = 10;
            series.columns.template.column.cornerRadiusTopLeft = 10;
            //series.interpolationDuration = 1500;
            //series.interpolationEasing = am4core.ease.linear;
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.verticalCenter = "bottom";
            labelBullet.label.dy = -10;
            labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

            chart.zoomOutButton.disabled = true;

            // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
            series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
            });

            setInterval(function () {
            am4core.array.each(chart.data, function (item) {
              item.visits += Math.round(Math.random() * 200 - 100);
              item.visits = Math.abs(item.visits);
            })
            chart.invalidateRawData();
            }, 2000)

            categoryAxis.sortBySeries = series;
          }); // end am4core.ready()
          
          this.loading = false
        }

      },
      async getDepartamentos() {
        this.provincias = [{itemId: '', nombre: 'Todos'}]
        this.municipios = [{itemId: '', nombre: 'Todos'}]
        let response = await axios.get(`${url}/departamentos`)
        if(response.status === 200) {
          this.departamentos = response.data.datos
          this.departamentos.unshift({
            itemId: '',
            nombre: 'Todos'
          })
        }
        this.getProjects()
      },
      async getProvincias() {
        this.provincias = [{itemId: '', nombre: 'Todos'}]
        this.municipios = [{itemId: '', nombre: 'Todos'}]
        this.provincia = ''
        this.municipio = ''
        if(this.departamento !== ''){
          let response = await axios.get(`${url}/provincias/${this.departamento}`)
          if(response.status === 200) {
            this.provincias = response.data.datos
            this.provincias.unshift({
              itemId: '',
              nombre: 'Todos'
            })
          }
        }
        this.getProjects()
      },
      async getMunicipios() {
        this.municipios = [{itemId: '', nombre: 'Todos'}]
        this.municipio = ''
        if(this.provincia !== ''){
          let response = await axios.get(`${url}/municipios/${this.provincia}`)
          if(response.status === 200) {
            this.municipios = response.data.datos
            this.municipios.unshift({
              itemId: '',
              nombre: 'Todos'
            })
          }
        }
        this.getProjects()
      },
      info(item) {
        this.project = item
        am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdivpie", am4charts.PieChart);

        // Add data
        chart.data = [ {
          "country": "Lithuania",
          "litres": 501.9
        }, {
          "country": "Czechia",
          "litres": 301.9
        }, {
          "country": "Ireland",
          "litres": 201.1
        }, {
          "country": "Germany",
          "litres": 165.8
        }, {
          "country": "Australia",
          "litres": 139.9
        }, {
          "country": "Austria",
          "litres": 128.3
        }, {
          "country": "UK",
          "litres": 99
        }
        ];

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "litres";
        pieSeries.dataFields.category = "country";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeOpacity = 1;

        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;

        chart.hiddenState.properties.radius = am4core.percent(0);


        }); // end am4core.ready()
        $('#modal1').modal('show');
      },
      chart3dColumnChart() {
         
      }
    }
})