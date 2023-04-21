use std::fs;
use std::path::Path;

// 读取应用配置
#[tauri::command]
pub fn system_read_config(app_handle: tauri::AppHandle) -> String {
    let config_path = get_config_path(app_handle);

    let content = match fs::read_to_string(config_path) {
      Ok(data) => data,
      Err(_) => "{}".to_string(),
    };

    content
}

#[tauri::command]
pub fn system_write_config(app_handle: tauri::AppHandle, config: String) {
    let config_path = get_config_path(app_handle);
    let path = Path::new(&config_path);

    // 判断文件夹是否存在
    if let Some(dir) = path.parent() {
        fs::create_dir_all(dir).unwrap();
    }

    fs::write(config_path, config).unwrap();
}

// 获取系统配置文件路径
fn get_config_path(app_handle: tauri::AppHandle) -> String {
    let mut file_path = app_handle.path_resolver().app_data_dir().unwrap();
    file_path.push("app.conf");
    let file_path = file_path.into_os_string().into_string().unwrap();

    file_path
}
