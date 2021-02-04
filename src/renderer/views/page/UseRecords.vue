<template>
  <div>
    <el-table :data="tableData" style="width: 100%" stripe>
      <el-table-column align="center" prop="id" label="ID" sortable></el-table-column>
      <el-table-column align="center" prop="user_id" label="用户ID" sortable></el-table-column>
      <el-table-column align="center" prop="username" label="用户名" sortable></el-table-column>
      <el-table-column align="center" prop="count" label="压缩数量" sortable></el-table-column>
      <el-table-column align="center" prop="createdate" label="压缩时间" sortable></el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px;"
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="total">
  </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allRecords: [],
      tableData: [],
      loading: null,
      currentPage: 1,
      total: 0,
    }
  },
  mounted() {
    this.loading = this.$loading({
      text: '加载中...',
      spinner: 'el-icon-loading'
    })
    this.getRecords()
  },
  methods: {
    handleCurrentChange(page) {
      this.currentPage = page
      this.tableData = this.getCurrentRecord()
    },
    getCurrentRecord() {
      return this.allRecords.slice((this.currentPage - 1)*5, this.currentPage*5)
    },
    getRecords() {
      this.$http.get('/get_compress_record').then(res => {
        console.log(res.data)
        this.loading.close()
        if (res.data.code === 200) {
          this.allRecords = res.data.result
          this.total = res.data.result.length
          this.tableData = this.getCurrentRecord()
        } else {
          this.$message.warning(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>