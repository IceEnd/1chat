use std::fs;
use one_chat::{get_app_dir_path, write_file};

// 读取应用配置
#[tauri::command]
pub fn read_config(app_handle: tauri::AppHandle) -> String {
    let config_path = get_config_path(app_handle);

    let content = match fs::read_to_string(config_path) {
      Ok(data) => data,
      Err(_) => "{}".to_string(),
    };

    content
}

#[tauri::command]
pub fn write_config(app_handle: tauri::AppHandle, config: String) {
    let config_path = get_config_path(app_handle);
    write_file(config_path, config);
}

// 获取系统配置文件路径
fn get_config_path(app_handle: tauri::AppHandle) -> String {
    let paths = ["app.conf".to_string()];
    let file_path = get_app_dir_path(app_handle, &paths);

    file_path
}
