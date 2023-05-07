use std::fs;
use std::path::Path;
use one_chat::{get_app_dir_path, write_file, delete_file};

// 读取会话状态以及内容
#[tauri::command]
pub fn read_state(app_handle: tauri::AppHandle) -> String {
    let config_path = get_state_path(app_handle);

    let state = match fs::read_to_string(config_path) {
      Ok(data) => data,
      Err(_) => "{}".to_string(),
    };

    state
}

#[tauri::command]
pub fn write_state(app_handle: tauri::AppHandle, state: String) {
    let config_path = get_state_path(app_handle);
    write_file(config_path, state);
}

// 读取所有会话
#[tauri::command]
pub fn read_session(app_handle: tauri::AppHandle) -> Vec<String> {
    let paths = ["session".to_string()];
    let session_dir = get_app_dir_path(app_handle, &paths);
    let path = Path::new(&session_dir);

    let mut session: Vec<String> = Vec::new();

    fs::create_dir_all(path).unwrap();

    let entries = path.read_dir().unwrap();
    for entry in entries {
        let file_path = entry.expect("Unable to get file path").path();
        if file_path.is_file() {
            let contents = match fs::read_to_string(file_path.clone()) {
                Ok(data) => data,
                Err(_) => {
                    println!("读取{}失败", file_path.clone().display().to_string());
                    "{}".to_string()
                },
            };
            session.push(contents);
        }
    }

    session
}

// 保存会话
#[tauri::command]
pub fn write_session(app_handle: tauri::AppHandle, id: String, content: String) {
    let paths = ["session".to_string(), id];
    let session_file = get_app_dir_path(app_handle, &paths);

    write_file(session_file, content);
}

// 删除会话
#[tauri::command]
pub fn delete_session(app_handle: tauri::AppHandle, id: String) {
    let paths = ["session".to_string(), id];
    let session_file = get_app_dir_path(app_handle, &paths);

    delete_file(session_file);
}

fn get_state_path(app_handle: tauri::AppHandle) -> String {
    let paths = ["session.conf".to_string()];
    let config_path = get_app_dir_path(app_handle, &paths);

    config_path
}
