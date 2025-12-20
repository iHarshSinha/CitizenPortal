package com.rasp.app.controller;
import com.rasp.app.resource.Gender;
import java.util.ArrayList;
import org.springframework.web.bind.annotation.GetMapping;
import java.lang.reflect.Field;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
 import org.springframework.web.bind.annotation.CrossOrigin;
@RestController
@CrossOrigin(origins = "*")
public class GenderController{
@GetMapping("/api/Gender")
  public List<Object>  getEnums() throws IllegalAccessException {
   Field[] fields = Gender.class.getFields();
 List<Object> names=new ArrayList<>();
 for(Field f:fields){
   if(f.getName().startsWith("ID")){
continue;
}
 Object value = f.get(null);
 names.add(value); 
 }
 return names;
}
}