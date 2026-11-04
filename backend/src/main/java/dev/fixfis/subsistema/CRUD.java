package dev.fixfis.subsistema;

import java.util.List;

public interface CRUD<ENTITY,PK> {
    ENTITY save(ENTITY entity);
    void deleteById(PK pk);
    ENTITY findById(PK pk);
    List<ENTITY> findAll();
}
