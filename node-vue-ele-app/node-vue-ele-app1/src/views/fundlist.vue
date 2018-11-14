 	<template>
 		<div class="fillcontain">
 			<div id="">
 				<el-form :inline='true' re='dad_data' :model='searchData'>
 					<!--筛选-->
 					<el-form-item label='按照时间筛选'>
 						 <el-date-picker
						      v-model="searchData.startTime"
						      type="datetime"
						      placeholder="选择开始时间"
						      >
						    </el-date-picker>
						    --
						    <el-date-picker
						      v-model="searchData.endTime"
						      type="datetime"
						      placeholder="选择结束时间"
						      >
						    </el-date-picker>
						    
 					</el-form-item>
 					<el-forme-item>
 						<el-button type='primary' size='samll' icon='search' @click=handleSearch()>筛选</el-button>
 					</el-forme-item>
 					<el-forme-item class='btnRight'>
 						<el-button type='primary' size='samll' icon='view' v-if='user.identity==manager' @click=handleAdd()>添加</el-button>
 					</el-forme-item>
 				</el-form>
 			</div>
 			<div class="table-Container">
 				<el-table
	 		 	v-if='tableData.length>0'
			    :data="tableData"
			    style="width: 100%"
			    max-height='450'>
			    <el-table-column
			      label="创建时间"
			      width="250"
			       prop='data'
			       align='center'>
			      	 <template slot-scope="scope">
				        <i class="el-icon-time"></i>
				        <span style="margin-left: 10px">{{ scope.row.data }}</span>
				      </template>
			    </el-table-column>
			     
			     <el-table-column
			     prop="type"
			      label="收支类型"
			      width="170"
			      align='center'>
			      
			    </el-table-column>
			     <el-table-column
			     prop="describe"
			      label="收支描述"
			      width="180"
			      align='center'>
			      
			    </el-table-column>
			     <el-table-column
			     prop="incode"
			      label="收入"
			      width="170"
			       align='right'>
			       <template slot-scope="scope">
			        <span style="color:#00d053">{{ scope.row.incode }}</span>
			      </template>
			    </el-table-column>
			     <el-table-column
			     prop="expend"
			      label="支出"
			      width="170" 
			       align='right'>
			      <template slot-scope="scope">
			        <span style="color:#f56767">{{ scope.row.expend }}</span>
			      </template>
			    </el-table-column>
			     <el-table-column
			      prop="cash"
			      label="账户现金"
			      width="170"
			       align='right'>
			       <template slot-scope="scope">
			        <span style="color:#4db3ff">{{ scope.row.cash }}</span>
			      </template>
			    </el-table-column>
			     <el-table-column
			     prop="remark"
			      label="备注"
			      width="220" 
			       align='center'>
			      
			    </el-table-column>
			     <el-table-column label="操作" align='center' prop="operation"  width='320' v-if='user.identity==manager'>
			      <template slot-scope="scope">
			        <el-button
			          size="small"
			          type='warning'
			          icon='edit'
			          
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="small"
			          type="danger"
			            icon='delete'
			          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			      </template>
			    </el-table-column>
	    	</el-table>
	 	<!--分页-->
	 	<el-row>
	 		<el-col :span='24'>
	 			<div class="pagination">
				     <el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page.sync="paginations.page_index"
				      :page-sizes="paginations.page_sizes"
				      :page-size="paginations.page_size"
				      :layout="paginations.layout"
				      :total="paginations.total">
				    </el-pagination>
   
	 			</div>
	 		</el-col>
	 	</el-row>
 		</div>
 		<Dialog :dialog="dialog" @update="getProfile" :formData='formData'></Dialog>	
 	</div>
</template>
<script>
	import Dialog from '../components/Dialog';
	export default{
		name:'fundList',
		data(){
			return {
				 //需要给分页组件传的信息
			      paginations: {
			        page_index: 1, // 当前位于哪页
			        total: 6, // 总数
			        page_size: 5, // 1页显示多少条
			        page_sizes: [5, 10, 15, 20], //每页显示多少条
			        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
			      },
			      searchData:{
			      	startTime:'',
			      	endTime:''
			      },
			      filterTableData:[],
				tableData:[],
				allTableData:[],
				formData:{
					type:'',
					describe:'',
					incode:'',
					expend:'',
					cash:'',
					remark:'',
					id:''
				},
				dialog:{
					show:false,
					title:'',
					option:'edit'
				}
			}
		},
		created(){
			this.getProfile();
		},
		computed:{
			user(){
				return this.$store.getters.user;
			}
		},
		methods:{
			//获取表格数据
			getProfile(){
				this.$axios.get('/list/api/profiles')
						.then(res=>{
//							console.log(res)
							this.allTableData=res.data;
							this.filterTableData=res.data; //存储过滤数据
							//设置分页数据
							this.setPaginations()
						})
						.catch(err=>console.log(err))
			},
			handleEdit(index,row){
				this.dialog.title='修改资金信息';
				this.dialog.show=true;
				this.dialog.option='edit';
				
				this.formData={
					type:row.type,
					describe:row.describe,
					incode:row.incode,
					expend:row.expend,
					cash:row.cash,
					remark:row.remark,
					id:row._id
				}
			},
			handleDelete(index,row){
			this.$axios.delete(`/list/api/profiles/delete/${row._id}`)
				.then(res=>{
					this.$message({
								message:'删除成功',
								type:'success'
							})
					this.getProfile();
				})
				
			},
			handleAdd(){
				this.dialog.show=true
				this.dialog.title='添加资金信息';
				this.dialog.option='add';
				
				this.formData={
					type:'',
					describe:'',
					incode:'',
					expend:'',
					cash:'',
					remark:'',
					id:''
				}
			},
			setPaginations(){
				//分页属性设置
				this.paginations.total=this.allTableData.length;
				this.paginations.page_index=1;
				this.paginations.page_size=5;
				//设置默认的分页数据
				this.tableData=this.allTableData.filter((item,index)=>{
					return index<this.paginations.page_size
				})
				
			},
			handleSizeChange(page_size){
				//切换size
				this.paginations.page_index=1;
				this.paginations.page_size=page_size;
				//设置默认的分页数据
				this.tableData=this.allTableData.filter((item,index)=>{
					return index<page_size
				})
				
			},
			handleCurrentChange(page){
				//获取当前页
				
				let index_i=this.paginations.page_size * (page - 1);
				//数据总数
				
				let nums=this.paginations.page_size*page;
				
				let tables=[];
				
				for( let i=index_i ; i<nums; i++){
					if(this.allTableData[i]){
						tables.push(this.allTableData[i])
					}
					this.tableData=tables;
				}
			},
			handleSearch(){
				//筛选功能
				if(!this.searchData.startTime || !this.searchData.endTime){
					this.$message({
						message:'请选择时间区间',
						type:'warning'
					});
					this.getProfile();
					return;
				}
				const sTime=this.searchData.startTime.getTime();
				const eTime=this.searchData.endTime.getTime();
				this.allTableData=this.filterTableData.filter(item=>{
					let date=new Date(item.data);
					let time=date.getTime();
					return time>=sTime && time<eTime
					
				});
				//分页数据调用
				this.setPaginations();
			}
		},
		components:{
			Dialog
		}
	}
	
</script>
<style scoped>
	.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>