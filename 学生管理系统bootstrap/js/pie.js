(function () {
	var pie = {
		init() {
			this.getData();
			this.option = {
				title: {
					// text: '某站点用户访问来源',
					text: '',
					subtext: '纯属虚构',
					left: 'center'
				},
				tooltip: {
					formatter: "{a} <br/>{b} : {c} ({d}%)"	//{a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
				},
				legend: {
					orient: 'vertical', //竖着排
					left: 'left',
					data: []    //请求到的数据格式不符合图例的格式，需要处理。所以这里先放个空对象 
					// data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
				},
				series: {
					// name: '访问来源',
					name: '',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: [],   //请求到的数据格式与这里要求的格式不符合，所以需要特殊处理一下
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			};
		},
		getData() {
			var self = this;
			$.ajax({
				url: 'http://api.duyiedu.com/api/student/findAll?appkey=kaivon_1574822824764',
				success: function (data) {
					console.log(JSON.parse(data));  //
					var list = JSON.parse(data).data;
					if (list.length > 0) {
						//画图
						self.areaChart(list);
						self.sexChart(list);
					} else {
						alert('亲，没有数据');
					}
				}
			})
		},
		areaChart(data) {
			var myChart = echarts.init($('.area')[0]);
			var legendData = [];
			var seriesData = [];

			//{"address":"哈尔滨","appkey":"kaivon_1574822824764","birth":1999,"ctime":1574838124,"email":"112@qq.com","id":39118,"name":"sewqe","phone":"18898989898","sNo":"34620","sex":0,"utime":1574838124}

			/*
				这里要做的是处理数据，把legend与series的数据处理成要求的格式
					1、legend的数据格式为["哈尔滨", "山东", "北京", "安徽砀山", "安徽芜湖"]
					2、series的数据格式为[{name: "北京", value: 2},...]
					3、legend里不能有重复的数据。而series里的value是重复的次数。那我可以通过一个对象来搞定它们。我把这个对象变成
						{哈尔滨: 3, 山东: 1, 北京: 2, 安徽砀山: 1, 安徽芜湖: 1}
					4、
			 */

			var newData = {};
			//处理legend的数据。需要的是原数据里的 address属性
			data.forEach(function (ele) {
				if (!newData[ele.address]) {    //把城市名当作key
					newData[ele.address] = 1;   //如果这条key还没用过，那让它的值为1。表示第一次出现
					legendData.push(ele.address);   //既然是第1次出现，就添加到legend数组里。第二次出现就不添加了
				} else {
					newData[ele.address]++; //走到这里就说明这个城市是第二次出现了，让它的值++
				}
			});

			//处理完这个对象了，log出来看看
			//console.log(newData);    //{哈尔滨: 3, 山东: 1, 北京: 2, 安徽砀山: 1, 安徽芜湖: 1}
			//console.log(legendData); //["哈尔滨", "山东", "北京", "安徽砀山", "安徽芜湖"]

			//处理series的数据。需要把城市名与出现的次数拼成一个对象
			for (var prop in newData) {
				seriesData.push({
                    name:prop,	//属性名
                    value:newData[prop]	//属性值
                });
			}
			//console.log(seriesData)   //[{name: "哈尔滨", value: 3},...]

			//再把其它的属性也改了
			this.option.title.text = '渡一教育学生地区分布统计';
			this.option.legend.data = legendData;
			this.option.series.name = '地区分布';
			this.option.series.data = seriesData;
			myChart.setOption(this.option);
		},
		sexChart(data) {
			var myChart = echarts.init($('.sex')[0]);
			var legendData = ['男', '女'];
			//var seriesData = [{ '男': 0 }, { '女': 0 }];

			var newData = {};
			//性别的数据存在data[i].sex身上
			data.forEach(function (ele) {
				if (!newData[ele.sex]) {	//把性别做为属性名
					newData[ele.sex] = 1;	//这个key是第一次出现
				} else {
					newData[ele.sex]++;		//这个key是第二次出现
				}
			});
			//console.log(newData);	//{0: 5, 1: 3}

			//因为只有两条数据，就不写循环了
			var seriesData = [
				{ name: '男', value: newData[0] },
				{ name: '女', value: newData[1] }
			];

			//修改其它属性
			this.option.title.text = '渡一教育学生性别统计';
			this.option.legend.data = legendData;
			this.option.series.name = '性别分布';
			this.option.series.data = seriesData;
			myChart.setOption(this.option);
		}
	}
	pie.init();
})();