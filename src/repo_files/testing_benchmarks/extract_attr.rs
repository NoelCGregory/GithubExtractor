use crate::models::attribute_model;
use tree_sitter::{ Tree};

pub fn extract(tree: Tree, source: String,error_array:Vec<String>) -> attribute_model::Attribute {
    let tree = tree.clone();
    let mut cursor = tree.walk();
    let mut number_constant = 0;
    let mut number_parser = 0;
    let mut number_declaration = 0;
    let mut number_control = 0;
    let mut number_if = 0;
    for child in tree.root_node().named_children(&mut cursor) {
        if child.is_error() {
        } else {
            match child.kind() {
                "constant_declaration" => {
                    number_constant += 1;
                }
                "parser_declaration" => {
                    number_parser += 1;
                    let t = child
                        .utf8_text(source.clone().as_bytes())
                        .unwrap()
                        .to_string();
                    let name = t.as_str().trim();
                    if (name.contains("if")) {
                        number_if += 1;
                    }
                }
                "type_declaration" => {
                    number_declaration += 1;

                    let type_kind_node = child.child_by_field_name("type_kind").unwrap();

                    match type_kind_node.kind() {
                        "typedef_declaration" => {}
                        "header_type_declaration" => {}
                        "header_union_declaration" => {}
                        "struct_type_declaration" => {}
                        "enum_declaration" => {}
                        "parser_type_declaration" => {}
                        "control_type_declaration" => {}
                        "package_type_declaration" => {}
                        _ => {}
                    };
                }
                "control_declaration" => {
                    number_control += 1;
                }
                _ => {}
            }
        };
    }
    let attr = attribute_model::Attribute {
        number_constant,
        number_parser,
        number_declaration,
        number_control,
        number_if,
        error_array
    };
    return attr;
}
