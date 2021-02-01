<template>
  <div>
    <el-upload
      action=""
      list-type="picture-card"
      :multiple="multiple"
      :limit="limit"
      :auto-upload="false"
      :on-change="uploadChange"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-row style="margin-top:15px;">
      <el-col :span="6">
        <el-input @input="chooseDir" v-model="outPutDirPath" size="small" placeholder="填写输出目录" />
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="6">
        <el-select style="width:100%;" size="small" v-model="optity" placeholder="请选择清晰度">
          <el-option
            v-for="item in optityArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="6">
        <el-button style="width:100%;" @click="imgDeal" type="primary" size="small">开始压缩</el-button>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  const fs = require('fs');
  const path = require('path');
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        multiple: true,
        limit: 50,
        file: null,
        fileList: [],
        compressFileList: [],
        compressFileListBase64: [],
        isFinish: false,
        loading: null,
        outPutDirPath: '',
        optityArr: [{
          label: '压缩50%',
          value: 1
        },{
          label: '压缩适中',
          value: 0.6
        },{
          label: '最大压缩',
          value: 0.1
        }],
        optity: 0.6
      };
    },
    mounted() {
      if (window.localStorage.getItem('outPutDirPath')) {
        this.outPutDirPath = window.localStorage.getItem('outPutDirPath')
      }
      // console.log(fs)
      // const dirpath = "D:/BF/Desktop/新建文件夹/"
      // fs.readdir(dirpath, function(err, files){
      //   if (err) {
      //       return console.error(err);
      //   }
      //   fs.mkdir("D:/BF/Desktop/新建文件夹/新目录",function(err){
      //     if (err) {
      //         return console.error(err);
      //     }
      //     console.log("目录创建成功。");
      //   });
      //   files.forEach( function (file){
      //       console.log( file );
      //       fs.stat(path.join(dirpath, file), function (error, result) {
      //         console.log(result.isDirectory(), result.isFile())
      //       })
      //   });
      // });
    },
    methods: {
      // 设置输出目录
      chooseDir(value) {
        console.log(value)
        this.outPutDirPath = value.replace(/\\/g,"/") + '/'
        if (this.outPutDirPath) {
          window.localStorage.setItem('outPutDirPath', this.outPutDirPath)
        }
      },
      uploadChange(file, fileList) {
        this.fileList = []
        if (fileList.length) {
          fileList.forEach(ele => {
            this.fileList.push(ele.raw)
          });
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      imgDeal() {
        this.loading = null
        this.isFinish = false
        this.compressFileList = []
        this.compressFileListBase64 = []
        if (this.fileList.length) {
          this.loading = this.$loading({
            text: '压缩中...'
          })
          this.fileList.forEach(ele => {
            this.file = ele
            this.imgCompress(ele)
          })
        }
      },
      getImageType(str) {
        var reg = /\.(png|jpg|gif|jpeg|webp)$/;
        return str.match(reg)[1];
      },
      // 将图片转为base64
      ToBase64(files) {
          const self = this;
          /*转换base64*/
          if (files.length) {
            files.forEach(file => {
              var imgFile = new FileReader();
              imgFile.readAsDataURL(file);
              imgFile.onload = function (e) {
                  var imgData = e.target.result; //base64数据
                  self.compressFileListBase64.push(imgData)
                  if (self.compressFileListBase64.length === self.fileList.length) {
                    self.isFinish = true
                    self.loading.close();
                    self.$message({
                      message: '压缩成功, 开始写入',
                      type: 'success'
                    });
                    self.startWrite()
                  }
              }
            })
          }
      },
      // 开始写入
      startWrite() {
        const self = this
        self.compressFileListBase64.forEach((ele, index) => {
          const base64Data = ele.replace(/^data:image\/\w+;base64,/, ""),
          dataBuffer = Buffer.from(base64Data, 'base64'),
          getName = self.fileList[index].name
          fs.writeFile(self.outPutDirPath + getName, dataBuffer, err => {
              if (err) {
                  throw err;
              };
              console.log('写入成功')
          });
        })
      },
      // 写入压缩后的图片
      writeCompressedImg(compressFileList) {
        if (!compressFileList || !compressFileList.length) return console.log('没有收到压缩图片列表')
        this.ToBase64(compressFileList)
      },
      // 处理图片
      imgCompress(file) {
          let self = this
          // 看支持不支持FileReader
          if (!file || !window.FileReader) return
          if (/^image/.test(file.type)) {
              // 创建一个reader
              let reader = new FileReader()
              // 将图片2将转成 base64 格式
              reader.readAsDataURL(file)
              // 读取成功后的回调
              reader.onloadend = function() {
                  let result = this.result
                  let img = new Image()
                  img.src = result
                  //判断图片是否大于500K
                  if (this.result.length <= 500 * 1024) {
                      console.log('文件小于500KB')
                  } else {
                      console.log('文件大于500KB')
                  }
                  img.onload = function() {
                      let data = self.compress(img)
                      self.compressFileList.push(self.dataURLtoFile(data, file))
                      // 判断是否完成
                      if (self.compressFileList.length === self.fileList.length) {
                        console.log(self.compressFileList, 'compressFileList')
                        self.writeCompressedImg(self.compressFileList)
                      }
                  }
              }
          }
      },
      // 压缩图片
      compress(img) {
          let canvas = document.createElement('canvas')
          let ctx = canvas.getContext('2d')
          //瓦片canvas
          let tCanvas = document.createElement('canvas')
          let tctx = tCanvas.getContext('2d')
          // let initSize = img.src.length;
          let width = img.width
          let height = img.height
          //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
          let ratio
          if ((ratio = (width * height) / 4000000) > 1) {
              // console.log("大于400万像素");
              ratio = Math.sqrt(ratio)
              width /= ratio
              height /= ratio
          } else {
              ratio = 1
          }
          canvas.width = width
          canvas.height = height
          //    铺底色
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          //如果图片像素大于100万则使用瓦片绘制
          let count
          if ((count = (width * height) / 1000000) > 1) {
              // console.log("超过100W像素");
              count = ~~(Math.sqrt(count) + 1) //计算要分成多少块瓦片
              //      计算每块瓦片的宽和高
              let nw = ~~(width / count)
              let nh = ~~(height / count)
              tCanvas.width = nw
              tCanvas.height = nh
              for (let i = 0; i < count; i++) {
              for (let j = 0; j < count; j++) {
                  tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
                  ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
              }
              }
          } else {
              ctx.drawImage(img, 0, 0, width, height)
          }
          //进行最小压缩
          let ndata = canvas.toDataURL('image/jpeg', this.optity)
          tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
          return ndata
      },
      //将base64转换为文件
      dataURLtoFile(data, file) {
          var arr = data.split(','),
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n)
          while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
          }
          return new File([u8arr], file.name, {
              type: file.type
          })
      },
    }
  }
</script>