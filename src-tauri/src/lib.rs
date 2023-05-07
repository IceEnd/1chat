use std::fs;
use std::path::Path;

/// 获取系统配置文件路径
pub fn get_app_dir_path(app_handle: tauri::AppHandle, names: &[String]) -> String {
    let mut file_path = app_handle.path_resolver().app_data_dir().unwrap();
    for name in names {
        file_path.push(name);
    }
    let file_path = file_path.into_os_string().into_string().unwrap();

    file_path
}

/// 写入文件
pub fn write_file(file: String, content: String) {
    let path = Path::new(&file);
    if let Some(dir) = path.parent() {
        fs::create_dir_all(dir).unwrap();
    }

    fs::write(file, content).unwrap();
}

/// 删除文件
pub fn delete_file(file: String) {
    if let Err(e) = fs::remove_file(file) {
        println!("删除文件失败: {}", e);
    }
}
