var config = {
	"customerCommand":[
		{
			"name":"fn",
			"out":"function %value%(){}"
		},
		{
			"name":"update",
			"out":"git pull origin '%value%||master'"
		},
		{
			"name":"commit",
			"out":"git commit -m'%value%' -a"
		},
		{
			"name":"kfc",
			"out":"肯德基"
		},
		{
			"name":"fanyi",
			"out":"open http://fanyi.baidu.com/#zh/en/%value%"
		}
		
	],
	"grid":"960*12*center",
	"jsEditorTheme":"blackboard",
	"browser":"ie8+,chrome,firefox",
	"customerKey":[
		{
			"name":"alt+d",
			"out":"delete "
		},
		{
			"name":"ctrl+s",
			"out":"save "
		},
		{
			"name":"alt+q",
			"out":"dev"
		},
		{
			"name":"alt+c",
			"out":"copy"
		},
		{
			"name":"alt+v",
			"out":"paste"
		},
		{
			"name":"shift+c",
			"out":"css"
		},
		{
			"name":"f1",
			"out":"open"
		},
		{
			"name":"ctrl+d",
			"out":"down"
		}
	]
}
