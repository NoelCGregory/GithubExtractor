use crate::models::file_model::File;
use std::string::String;
pub struct FileBuilder {
    pub file_name: String,
    pub url: String,
    pub num_similar: i64,
    pub p4c: bool,
    pub tree_sitter: bool,
    pub hashcode: String,
    pub subset: i32,
    pub error: String,
    pub error_p4c: String,
}

pub trait Builder {
    fn new(name: String, hashcode: String, url: String) -> Self;
    fn new_file(file: &File) -> Self;
    fn file_name(&mut self, file_name: String);
    fn add_error(&mut self, error: String);

    fn add_error_p4c(&mut self, error: String);
    fn add_subset(&mut self, subset: i32);
    fn add_p4c_state(&mut self, state: bool);
    fn add_tree_sitter_state(&mut self, state: bool);
    fn add_to_num_similar(&mut self);
    fn build(&self) -> File;
}

impl Builder for FileBuilder {
    fn new(name: String, hashcode: String, url: String) -> Self {
        FileBuilder {
            file_name: name,
            url: url,
            num_similar: 1,
            p4c: false,
            tree_sitter: false,
            hashcode: hashcode,
            subset: 0,
            error: String::from("None"),
            error_p4c: String::from("None"),
        }
    }

    fn add_error(&mut self, error: String) {}
    fn add_error_p4c(&mut self, error: String) {}

    fn new_file(file: &File) -> Self {
        FileBuilder {
            file_name: file.file_name.clone(),
            url: file.url.clone(),
            num_similar: file.num_similar.clone(),
            p4c: file.p4c.clone(),
            tree_sitter: file.tree_sitter.clone(),
            hashcode: file.hashcode.clone(),
            subset: file.subset.clone(),
            error: file.error.clone(),
            error_p4c: file.error_p4c.clone(),
        }
    }
    fn add_p4c_state(&mut self, state: bool) {
        self.p4c = state;
    }
    fn add_tree_sitter_state(&mut self, state: bool) {
        self.tree_sitter = state;
    }
    fn file_name(&mut self, file_name: String) {
        self.file_name = file_name;
    }
    fn add_to_num_similar(&mut self) {
        self.num_similar += 1;
    }
    fn add_subset(&mut self, subset: i32) {
        self.subset = subset;
    }

    fn build(&self) -> File {
        return File {
            file_name: self.file_name.clone(),
            url: self.url.clone(),
            num_similar: self.num_similar.clone(),
            p4c: self.p4c.clone(),
            tree_sitter: self.tree_sitter.clone(),
            hashcode: self.hashcode.clone(),
            subset: self.subset.clone(),
            error: self.error.clone(),
            error_p4c: self.error_p4c.clone(),
        };
    }
}
