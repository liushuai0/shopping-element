/ *
* 文件名：userManager
* 作者： 刘帅
* 描述：角色列表
* 创建时间：2020-05-25
* /
<template>
    <div>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-button type="primary" @click="addJueSe()">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="jueSeList" highlight-current-row style="width: 100%;" >
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column :index="indexMethod" label="序号"  type="index" width="60">
                </el-table-column>
                <el-table-column label="角色名称" prop="roleName" sorable >
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"  >
                </el-table-column>
                <el-table-column label="操作" width="270" >
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" size="small" type="primary">编辑</el-button>
                        <el-button @click="handleDel(scope.$index, scope.row)" size="small" type="danger">删除</el-button>
                        <el-button @click="handlePms(scope.row)" size="small" type="warning">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :visible.sync="dialogEditVisible"
                       title="提示"
                       width="30%">
                <el-form :model="editJueSeList" ref="editUserFormRef">
                    <el-form-item label="角色名称" prop="roleName"  width="120">
                        <el-input :disabled="dialogStatus==='1'" v-model="editJueSeList.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc"  >
                        <el-input v-model="editJueSeList.roleDesc"></el-input>
                    </el-form-item>


                </el-form>
                <span class="dialog-footer" slot="footer">
                    <el-button @click="dialogEditVisible = false">取 消</el-button>
                    <el-button @click="editSave()" type="primary">确 定</el-button>
                </span>

            </el-dialog>
            <el-dialog :visible.sync="dialogFenPeiVisible" @close="setRightDialogClosed" title="分配权限" width="50%">
                <el-tree
                        :data="quanxianTree"
                        show-checkbox
                        default-expand-all
                        :default-checked-keys="defaultCheckdArr"
                        node-key="id"
                        ref="treeRef"
                        highlight-current
                        :props="defaultProps">
                </el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogFenPeiVisible = false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>



            </el-dialog>



        </el-card>

    </div>

</template>

<script>
    import {reqJueSeList,addJueSe,editJueSe,delJueSe,queryJueSeById,reqQuanXianTree,savePms} from '../../api/index'
    export default {
        name: "perUser",
        data(){
            return{
                jueSeList:[],
                editJueSeList:{},
                currentPage:1,
                listQuery: {
                    'query': '',
                    'pagenum': 1,// 当前页数
                    'pagesize': 15// 每页显示多少数据
                },
                dialogStatus:null, //添加还是修改表单 0添加 1修改
                dialogEditVisible:false,
                dialogFenPeiVisible:false,  //分配任务窗口
                quanxianTree:[],   //权限数组
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                defaultCheckdArr:[],
                //   当前即将分配权限的Id
                roleId: 0
            }
        },
        computed:{
            indexMethod(index) {
                return (this.listQuery.pagenum-1)*this.listQuery.pagesize+ this.currentPage ;
            }
        },
        mounted(){
          this.getJueSeList()
        },
        methods:{
            async getJueSeList(){
                let _result = await reqJueSeList();

                 this.$nextTick(function () {
                    this.jueSeList=_result.data
                })


            },
            addJueSe(){
                this.dialogStatus = '0';
                this.dialogEditVisible=true
            },
            async handleEdit(index,row){
                this.dialogStatus = '1';
                this.dialogEditVisible = true;//放在第一个   this.$nextTick 可以在下次打开的时候重置表单数据
                console.log(row);
                const _result = await queryJueSeById(row.id);
                console.log(_result);

                if (_result.meta.status !== 200) {
                    return this.$message.error('查询角色失败！')
                }
                this.$nextTick(()=>{
                    this.editJueSeList = _result.data
                });
            },
            async editSave(){
                if(this.dialogStatus==='0'){
                    const _result = await addJueSe(this.editJueSeList);
                    if (_result.meta.status !== 201) {
                        return this.$message.error('添加角色失败！')
                    }
                    this.$message.success("添加用户成功")
                }else if(this.dialogStatus==='1'){
                    const _result = await editJueSe(this.editJueSeList);
                    if (_result.meta.status !== 200) {
                        return this.$message.error('编辑角色失败！')
                    }
                    this.$message.success("编辑用户成功")
                }
                this.dialogEditVisible = false;
                this.getJueSeList()
            },
            async handleDel(index,row){
                const confirmResult= await this.$confirm('确定删除此用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(error => error);
                // 点击确定 返回值为：confirm
                // 点击取消 返回值为： cancel
                if (confirmResult !== 'confirm') {
                    return  this.$message.info('已取消删除')
                }
                const _result = await delJueSe(row.id);
                if (_result.meta.status !== 200) {
                    return this.$message.error('删除角色失败！')
                }
                this.$message.success("删除用户成功");
                this.getJueSeList()
            },
            async allotRights(){
                console.log(this);
                // var checkIdList=this.$refs.treeRef.getCheckedKeys()
                // var harfCheckIdList =this.$refs.treeRef.getHalfCheckedKeys()
                // checkIdList=checkIdList.concat(harfCheckIdList)
                //
                // console.log(checkIdList)

                // 获得当前选中和半选中的Id
                var checkIdList = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];

                console.log(checkIdList);
                checkIdList = checkIdList.join(',');
                var _result = await savePms(this.roleId, checkIdList);
                console.log(_result);
                if (_result.meta.status !== 200) {
                    return this.$message.error('角色授权失败！')
                }
                this.$message.success("角色授权成功");

                this.dialogFenPeiVisible=false
            },
            //分配权限点击
            handlePms: async function (row) {
                console.log(row);
                console.log("dakaile ");
                console.log(this.quanxianTree);
                this.roleId = row.id;
                const _result = await reqQuanXianTree('tree');
                if (_result.meta.status !== 200) {
                    return this.$message.error('获取权限树失败！')
                }
                console.log(_result);


                this.quanxianTree = _result.data;
                //   递归获取三级节点的id
                this.getLeafkeys(row, this.defaultCheckdArr);


                this.dialogFenPeiVisible = true

            },
            // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
            getLeafkeys (node, arr) {
                // 没有children属性，则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => this.getLeafkeys(item, arr))
            },
            // 权限对话框关闭事件
            setRightDialogClosed () {
                console.log("guanbile ");

                this.quanxianTree = [];
                this.defaultCheckdArr = [];
                this.getJueSeList()
            },
        }
    }
</script>

<style scoped>

</style>
