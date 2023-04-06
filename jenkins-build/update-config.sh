
# 修改项目配置，方便为不同的环境构建
echo '------ begin edit project config file ------'

configFile=src/utils/config.js

# 修改前
echo '------ config file[$configFile] content before edit ------'
cat $configFile

# 修改文件
preLivebosUrl=""
sed -ri "/[ ]*preLivebosUrl/s/^([ ]*preLivebosUrl:[ ]*')[^']+('.*)/\1$preLivebosUrl\2/" $configFile

# 修改后
echo '------ config file[$configFile] content after edit ------'
cat $configFile
