pub struct File {
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

impl File {
    fn new(
        file_name: String,
        url: String,
        num_similar: i64,
        p4c: bool,
        tree_sitter: bool,
        hashcode: String,
        subset: i32,
        error: String,
        error_p4c: String,
    ) -> File {
        return File {
            file_name,
            url,
            num_similar,
            p4c,
            tree_sitter,
            hashcode,
            subset,
            error,
            error_p4c,
        };
    }
}
