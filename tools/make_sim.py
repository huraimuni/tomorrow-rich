# index.html 에서 시뮬레이션용 sim.html 을 만든다 (게임 내부 함수를 window.__G 로 노출)
t=open('../index.html').read()
i=t.rindex('})();\n</script>')
hook="""
window.__G={EV:EV,newGame:function(){newGame({gender:'m',skin:'#f1c9a0',style:0,hairColor:'#2a1a10',outfit:OUTFITS[5]},'sim');},nextDay:nextDay,S:function(){return S},net:net,resolveChoice:resolveChoice,buyAsset:buyAsset,sellAsset:sellAsset,evById:evById,ASSETS:ASSETS,JOBS:JOBS,applyJob:applyJob,jobWage:jobWage,debt:debt};
"""
open('sim.html','w').write(t[:i]+hook+t[i:])
