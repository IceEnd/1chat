// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod setup;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::system::system_read_config,
            commands::system::system_write_config,
        ])
        .setup(setup::init)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
