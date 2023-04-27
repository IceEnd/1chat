// 获取系统配置文件路径
pub fn get_app_dir_path(app_handle: tauri::AppHandle, name: String) -> String {
    let mut file_path = app_handle.path_resolver().app_data_dir().unwrap();
    file_path.push(name);
    let file_path = file_path.into_os_string().into_string().unwrap();

    file_path
}
