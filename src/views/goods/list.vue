/ *
* 文件名：list
* 作者： 刘帅
* 描述：商品列表
* 创建时间：2020-05-25
* /
<template>

    <div>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">

                    <el-input  clearable placeholder="请输入内容" v-model="listQuery.query">
                        <el-button @click="getTableList()" icon="el-icon-search" slot="append" type="primary"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button @click="addUser()" type="primary">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData"  highlight-current-row style="width: 100%;" v-loading="listLoading">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column :index="indexMethod" label="序号"  type="index" width="60">
                </el-table-column>
                <el-table-column label="商品名称" prop="goods_name" sorable>
                </el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price"  >
                </el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" >
                </el-table-column>
                <el-table-column label="商品数量" prop="goods_number"  >
                </el-table-column>

                <el-table-column label="创建时间" prop="add_time" >
                </el-table-column>

                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" size="small">编辑</el-button>
                        <el-button @click="handleDel(scope.$index, scope.row)" size="small" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
    import {getShopList,delShopList} from '../../api/index'
    export default {
        name: "list",
        data(){
            return{
                listQuery:{
                    'query':'',
                    'pagenum': 1,// 当前页数
                    'pagesize': 15// 每页显示多少数据
                },
                listLoading: true,
                tableData: [],
                index:1
            }
        },
        computed:{
            indexMethod(index) {
                return (this.listQuery.pagenum-1)*this.listQuery.pagesize+ this.index ;
            }
        },
        mounted(){
          this.getTableList()
        },

        methods:{
            async getTableList(){
                let _result=await getShopList(this.listQuery)
                if(_result.meta.status!==200){
                    return this.$message.error('获取商品列表失败！')
                }
                this.tableData=_result.data.goods
                this.listLoading=false
                console.log(_result)
            },

            addUser(){
                this.$router.push('/list/add')
            },
            async handleDel(index,row){
                const confirmResult= await this.$confirm('清点删除该商品？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(error => error);
                if (confirmResult !== 'confirm') {
                    return  this.$message.info('已取消删除')
                }
                const result= await  delShopList(row.goods_id)
                if (result.meta.status !== 200) {
                    return this.$message.error('删除失败！')
                }
                this.$message.success("删除成功")
                this.getTableList()

            }
        }
    }
</script>

<style scoped>

</style>
