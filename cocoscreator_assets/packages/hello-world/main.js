var path = require('path');
var fs = require('fs');

function onBeforeBuildFinish (options, callback) {
    Editor.log(options);
    callback();
    var srcPath = path.join(options.buildPath, 'stone_ranking');
    var dstPath = path.join(options.dest, 'stone_ranking');
    copy(srcPath, dstPath);
    Editor.log('copy finish');
}
stat = fs.stat;

/*

05

 * 复制目录中的所有文件包括子目录

06

 * @param{ String } 需要复制的目录

07

 * @param{ String } 复制到指定的目录

08

 */

var copy = function( src, dst ){

    // 读取目录中的所有文件/目录

    fs.readdir( src, function( err, paths ){

        if( err ){

            throw err;

        }

        paths.forEach(function( pathName ){

            var _src = path.join(src, pathName),
                _dst = pathName path.join(dst, pathName),
                readable, writable;      
                
            stat( _src, function( err, st ){
                Editor.log('stat')
                if( err ){

                    Editor.log('Error stat');
                    return;

                }
  
                // 判断是否为文件
                if( st.isFile() ){
                    // 创建读取流
                    readable = fs.createReadStream( _src );
                    // 创建写入流
                    writable = fs.createWriteStream( _dst ); 
                    Editor.log('copy', _src, _dsc)
                    // 通过管道来传输流
                    readable.pipe( writable );
                }
                // 如果目录则递归调用自身

                else if( st.isDirectory() ){

                    exists( _src, _dst, copy );

                }

            });

        });

    });

};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录

var exists = function( src, dst, callback ){

    fs.exists( dst, function( exists ){

        // 已存在

        if( exists ){

            callback( src, dst );

        }

        // 不存在

        else{

            fs.mkdir( dst, function(){

                callback( src, dst );

            });

        }

    });

};
module.exports = {
    load () {
        Editor.log('Hello load!');
        Editor.Builder.on('before-change-files', onBeforeBuildFinish);
    },

    unload () {
        Editor.log('Hello unload!');
        Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
    },

    messages: {
        'testMsg' () {
          Editor.log('Hello underworld!');
            Editor.log('fs', fs)
            Editor.log('path', path)
        },
    },
};